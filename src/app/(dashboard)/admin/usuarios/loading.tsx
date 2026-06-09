import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="px-8 md:px-12 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <Skeleton className="h-9 w-72 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/20 shadow-sm overflow-hidden">
        <div className="bg-[#dae2fd] px-8 py-4">
          <Skeleton className="h-3.5 w-52" />
        </div>
        <div className="divide-y divide-[#c3c6d7]/20">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-8 py-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-24 rounded-sm" />
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
