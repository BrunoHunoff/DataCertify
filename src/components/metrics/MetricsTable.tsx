'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Paperclip, Pencil, Trash2, UploadCloud } from 'lucide-react'
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
import { formatDate, formatNumber } from '@/lib/utils'
import { deleteMetricAction } from '@/app/actions/metrics'
import type { MetricWithRelations } from '@/lib/types'

interface MetricsTableProps {
  metrics: MetricWithRelations[]
  projectId: string
}

const PAGE_SIZE = 10

// Map a metric to a cert status for the badge
function metricStatus(metric: MetricWithRelations) {
  if (metric.files.length > 0) return 'VALID' as const
  return 'PENDING' as const
}

export function MetricsTable({ metrics, projectId }: MetricsTableProps) {
  const [page, setPage] = useState(0)
  const [isPending, startTransition] = useTransition()

  const totalPages = Math.ceil(metrics.length / PAGE_SIZE)
  const visible = metrics.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleDelete(metricId: string) {
    if (!confirm('Excluir este lançamento permanentemente?')) return
    startTransition(async () => {
      const result = await deleteMetricAction(metricId, projectId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Lançamento excluído.')
      }
    })
  }

  // Export CSV
  function handleExportCSV() {
    const headers = ['Data', 'Tipo de Material', 'Quantidade', 'Unidade', 'Status']
    const rows = metrics.map((m) => [
      formatDate(m.dateLogged),
      m.description ?? '—',
      m.value.toString(),
      m.unit,
      m.files.length > 0 ? 'Concluído' : 'Pendente',
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `metricas-${projectId}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (metrics.length === 0) {
    return (
      <div className="text-center py-16 text-[#737686]">
        <p className="text-sm font-semibold">Nenhum lançamento registrado</p>
        <p className="text-xs mt-1">
          Clique em &quot;Novo Lançamento&quot; para adicionar.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          className="bg-[#eaedff] text-[#394c84] hover:bg-[#dbe1ff] text-xs"
        >
          Exportar CSV
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#c3c6d7]/20 shadow-sm overflow-hidden">
        {/* Header bar */}
        <div className="bg-[#dae2fd]/50 px-8 py-4 flex items-center justify-between border-b border-[#c3c6d7]/20">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#434655]">
            Histórico de Lançamentos
          </h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#c3c6d7]/30 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                  Data do Lançamento
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                  Tipo de Material
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8 text-right">
                  Quantidade
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                  Evidência
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                  Status
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8 text-right">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((metric) => {
                const firstFile = metric.files[0]
                const status = metricStatus(metric)

                return (
                  <TableRow
                    key={metric.id}
                    className="border-[#c3c6d7]/20 hover:bg-[#f2f3ff] transition-colors group"
                  >
                    <TableCell className="px-8 py-5 text-sm font-medium text-[#131b2e]">
                      {formatDate(metric.dateLogged)}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-sm text-[#434655]">
                      {metric.description ?? '—'}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-sm font-bold text-[#131b2e] text-right">
                      {formatNumber(metric.value, metric.unit)}
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      {firstFile ? (
                        <a
                          href={firstFile.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#004ac6] hover:underline text-xs font-semibold"
                        >
                          <Paperclip className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[160px]">
                            {firstFile.fileName}
                          </span>
                        </a>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[#c3c6d7] italic text-xs">
                          <UploadCloud className="w-3.5 h-3.5" />
                          Anexo Ausente
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <StatusBadge
                        status={status}
                        label={status === 'VALID' ? 'Concluído' : 'Pendente'}
                      />
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="text-[#737686] hover:text-[#004ac6] h-7 w-7 p-0"
                          title="Editar (em breve)"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleDelete(metric.id)}
                          className="text-[#737686] hover:text-[#ba1a1a] h-7 w-7 p-0"
                          title="Excluir"
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
            Exibindo {visible.length} de {metrics.length} lançamentos
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
    </div>
  )
}
