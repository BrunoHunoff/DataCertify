'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  ChevronDown,
  ChevronUp,
  Paperclip,
  Target,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate, formatNumber, cn } from '@/lib/utils'
import { deleteMetricAction, deleteMetricEntryAction } from '@/app/actions/metrics'
import { NewMetricModal } from './NewMetricModal'
import { MetricEntryModal } from './MetricEntryModal'
import type { MetricWithEntries } from '@/lib/types'

interface MetricCardProps {
  metric: MetricWithEntries
  projectId: string
  certificationId: string
}

export function MetricCard({ metric, projectId, certificationId }: MetricCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()

  const total = metric.entries.reduce((sum, e) => sum + e.quantity, 0)
  const progress = metric.goal > 0 ? Math.min((total / metric.goal) * 100, 100) : 0
  const hasEntries = metric.entries.length > 0

  function handleDeleteMetric() {
    if (!confirm(`Excluir a métrica "${metric.name}" e todos os seus lançamentos permanentemente?`)) return
    startTransition(async () => {
      const result = await deleteMetricAction(metric.id, projectId, certificationId)
      if (result.error) toast.error(result.error)
      else toast.success('Métrica excluída.')
    })
  }

  function handleDeleteEntry(entryId: string) {
    if (!confirm('Excluir este lançamento permanentemente?')) return
    startTransition(async () => {
      const result = await deleteMetricEntryAction(entryId, projectId, certificationId)
      if (result.error) toast.error(result.error)
      else toast.success('Lançamento excluído.')
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-[#c3c6d7]/20 shadow-sm overflow-hidden">
      {/* Card header — always visible */}
      <div
        className="px-6 py-5 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: name + certification tag */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-base font-bold text-[#131b2e] truncate">
                {metric.name}
              </h3>
              {metric.certification && (
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#dae2fd] text-[#004ac6] px-2 py-0.5 rounded-full shrink-0">
                  {metric.certification.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#737686]">
              <Target className="w-3 h-3 shrink-0" />
              <span>
                Meta: {formatNumber(metric.goal, metric.unit)} &nbsp;·&nbsp;{' '}
                {metric.entries.length} lançamento{metric.entries.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Right: total + progress + actions */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-lg font-extrabold text-[#131b2e] leading-none">
                {formatNumber(total, metric.unit)}
              </p>
              <p className="text-[10px] text-[#737686] font-medium mt-0.5">
                {progress.toFixed(0)}% da meta
              </p>
            </div>

            {/* Action buttons — stop propagation so clicks don't toggle expand */}
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <NewMetricModal
                projectId={projectId}
                certificationId={certificationId}
                metric={metric}
              />
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={handleDeleteMetric}
                className="text-[#737686] hover:text-[#ba1a1a] h-7 w-7 p-0"
                title="Excluir métrica"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            {expanded ? (
              <ChevronUp className="w-4 h-4 text-[#737686]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#737686]" />
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-[#f2f3ff] rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              progress >= 100 ? 'bg-[#1a7f4b]' : 'bg-[#004ac6]',
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Expanded: entries list */}
      {expanded && (
        <div className="border-t border-[#c3c6d7]/20">
          {/* Entries table header */}
          <div className="bg-[#dae2fd]/40 px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Lançamentos
            </p>
            <MetricEntryModal
              metricId={metric.id}
              projectId={projectId}
              certificationId={certificationId}
              unit={metric.unit}
            />
          </div>

          {!hasEntries ? (
            <div className="px-6 py-8 text-center text-xs text-[#737686]">
              Nenhum lançamento ainda. Clique em &quot;Novo Lançamento&quot; para começar.
            </div>
          ) : (
            <div className="divide-y divide-[#c3c6d7]/10">
              {/* Column labels */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-2 bg-[#f2f3ff]/50">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#737686]">Data</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#737686] text-right">Quantidade</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#737686]">Anexo</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#737686] text-right">Ações</span>
              </div>

              {metric.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-4 items-center hover:bg-[#f2f3ff] transition-colors group"
                >
                  <span className="text-sm text-[#131b2e] font-medium">
                    {formatDate(entry.date)}
                  </span>
                  <span className="text-sm font-bold text-[#131b2e] text-right">
                    {formatNumber(entry.quantity, metric.unit)}
                  </span>
                  <span>
                    {entry.fileUrl ? (
                      <a
                        href={entry.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#004ac6] hover:underline text-xs font-semibold"
                      >
                        <Paperclip className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[160px]">
                          {entry.fileName ?? 'Anexo'}
                        </span>
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 text-[#c3c6d7] italic text-xs">
                        <UploadCloud className="w-3.5 h-3.5" />
                        Sem anexo
                      </span>
                    )}
                  </span>
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MetricEntryModal
                      metricId={metric.id}
                      projectId={projectId}
                      certificationId={certificationId}
                      unit={metric.unit}
                      entry={entry}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-[#737686] hover:text-[#ba1a1a] h-7 w-7 p-0"
                      title="Excluir lançamento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
