import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  change?: string
  changePositive?: boolean
  className?: string
}

export function StatCard({
  title,
  value,
  unit,
  change,
  changePositive = true,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-6 border border-[#c3c6d7]/20 shadow-sm',
        className,
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#737686] mb-3">
        {title}
      </p>
      <div className="flex items-end gap-1.5">
        <span className="text-5xl font-bold tracking-tighter text-[#131b2e] leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-base font-medium text-[#737686] mb-0.5">{unit}</span>
        )}
      </div>
      {change && (
        <div
          className={cn(
            'flex items-center gap-1.5 mt-3 text-xs font-semibold',
            changePositive ? 'text-[#004ac6]' : 'text-[#ba1a1a]',
          )}
        >
          {changePositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{change}</span>
        </div>
      )}
    </div>
  )
}
