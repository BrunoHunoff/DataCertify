import { cn } from '@/lib/utils'
import type { CertStatus } from '@/lib/types'

const variants: Record<CertStatus, string> = {
  VALID: 'bg-[#dbe1ff] text-[#003ea8]',
  PENDING: 'bg-[#ffdbcd] text-[#7d2d00]',
  EXPIRED: 'bg-[#ffdad6] text-[#93000a]',
}

const labels: Record<CertStatus, string> = {
  VALID: 'Válido',
  PENDING: 'Pendente',
  EXPIRED: 'Expirado',
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
