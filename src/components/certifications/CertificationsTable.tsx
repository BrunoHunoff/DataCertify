'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { ChevronDown, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import { deleteCertificationAction, updateCertificationStatusAction } from '@/app/actions/certifications'
import type { CertStatus, Certification, ProjectCertification } from '@prisma/client'

type CertRow = ProjectCertification & { certification: Certification }

interface CertificationsTableProps {
  certifications: CertRow[]
  projectId: string
}

const PAGE_SIZE = 10

const STATUS_OPTIONS: { value: CertStatus; label: string }[] = [
  { value: 'PENDING',     label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Em Andamento' },
  { value: 'VALID',       label: 'Concluído' },
  { value: 'CANCELLED',   label: 'Cancelado' },
]

export function CertificationsTable({
  certifications,
  projectId,
}: CertificationsTableProps) {
  const [page, setPage] = useState(0)
  const [isPending, startTransition] = useTransition()

  const totalPages = Math.ceil(certifications.length / PAGE_SIZE)
  const visible = certifications.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleDelete(certificationId: string) {
    if (!confirm('Remover este certificado do projeto?')) return
    startTransition(async () => {
      const result = await deleteCertificationAction(certificationId, projectId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Certificado removido.')
      }
    })
  }

  function handleStatusChange(certificationId: string, status: CertStatus) {
    startTransition(async () => {
      const result = await updateCertificationStatusAction(certificationId, projectId, status)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Status atualizado.')
      }
    })
  }

  if (certifications.length === 0) {
    return (
      <div className="text-center py-16 text-[#737686]">
        <p className="text-sm font-semibold">Nenhum certificado cadastrado</p>
        <p className="text-xs mt-1">Clique em &quot;Novo Certificado&quot; para adicionar.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#c3c6d7]/20 shadow-sm overflow-hidden">
      {/* Table header bar */}
      <div className="bg-[#dae2fd] px-8 py-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#434655]">
          Inventário de Documentação
        </h3>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#c3c6d7]/30 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                Nome do Certificado
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8 text-center">
                Status
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8 text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row) => {
              const cert = row.certification

              return (
                <TableRow
                  key={row.id}
                  className="border-[#c3c6d7]/20 hover:bg-[#f2f3ff] transition-colors group"
                >
                  <TableCell className="px-8 py-5">
                    <div>
                      <p className="text-sm font-bold text-[#131b2e]">{cert.name}</p>
                      {cert.level && (
                        <p className="text-[10px] text-[#737686] font-medium mt-0.5">
                          {cert.level}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-8 py-5 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={isPending}
                        className="inline-flex items-center gap-1 group/status focus:outline-none disabled:opacity-50"
                      >
                        <StatusBadge status={cert.status} />
                        <ChevronDown className="w-3 h-3 text-[#737686] opacity-0 group-hover/status:opacity-100 transition-opacity" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="min-w-[150px]">
                        {STATUS_OPTIONS.map((opt) => (
                          <DropdownMenuItem
                            key={opt.value}
                            disabled={cert.status === opt.value}
                            onClick={() => handleStatusChange(cert.id, opt.value)}
                            className="text-xs font-medium cursor-pointer"
                          >
                            {opt.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  <TableCell className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/projetos/${projectId}/certificados/${cert.id}/metricas`}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#004ac6] hover:underline"
                      >
                        Ver Métricas
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleDelete(cert.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#737686] hover:text-[#ba1a1a] h-7 w-7 p-0 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-4 bg-[#f2f3ff] border-t border-[#c3c6d7]/20 flex items-center justify-between">
        <p className="text-xs text-[#737686] font-medium">
          Mostrando {Math.min(visible.length, PAGE_SIZE)} de {certifications.length} entradas
        </p>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="text-xs border-[#c3c6d7]/40"
          >
            Anterior
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={i === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPage(i)}
              className={`text-xs w-8 ${
                i === page
                  ? 'bg-[#004ac6] hover:bg-[#003ea8] text-white border-none'
                  : 'border-[#c3c6d7]/40'
              }`}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs border-[#c3c6d7]/40"
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}
