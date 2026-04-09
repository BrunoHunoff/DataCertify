'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import { deleteCertificationAction } from '@/app/actions/certifications'
import type { Certification, ProjectCertification } from '@prisma/client'

type CertRow = ProjectCertification & { certification: Certification }

interface CertificationsTableProps {
  certifications: CertRow[]
  projectId: string
}

const PAGE_SIZE = 10

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
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                Data de Emissão
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                Data de Validade
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
              const isExpiredDate =
                cert.expiresAt && new Date(cert.expiresAt) < new Date()

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
                  <TableCell className="px-8 py-5 text-sm text-[#434655] font-medium">
                    {formatDate(cert.issuedAt)}
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    <span
                      className={`text-sm font-medium ${
                        isExpiredDate ? 'text-[#ba1a1a] font-bold' : 'text-[#434655]'
                      }`}
                    >
                      {formatDate(cert.expiresAt)}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-5 text-center">
                    <StatusBadge status={cert.status} />
                  </TableCell>
                  <TableCell className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/projetos/${projectId}/metricas?certId=${cert.id}`}
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
