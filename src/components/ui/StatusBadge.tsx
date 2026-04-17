import { cn } from '@/lib/utils'
import type { CertStatus } from '@/lib/types'

const variants: Record<CertStatus, string> = {
  VALID:       'bg-[#d4f0e0] text-[#1a7f4b]',
  PENDING:     'bg-[#ffdbcd] text-[#7d2d00]',
  EXPIRED:     'bg-[#ffdad6] text-[#93000a]',
  IN_PROGRESS: 'bg-[#dae2fd] text-[#003ea8]',
  CANCELLED:   'bg-[#e8e8e8] text-[#444]',
}

const labels: Record<CertStatus, string> = {
  VALID:       'Concluído',
  PENDING:     'Pendente',
  EXPIRED:     'Expirado',
  IN_PROGRESS: 'Em Andamento',
  CANCELLED:   'Cancelado',
}

interface StatusBadgeProps {
  status: CertStatus
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider',
        variants[status],
        className,
      )}
    >
      {label ?? labels[status]}
    </span>
  )
}
