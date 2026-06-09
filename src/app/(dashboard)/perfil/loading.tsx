import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="px-8 md:px-12 py-10 max-w-2xl mx-auto">
      <Skeleton className="h-3 w-16 mb-2" />
      <Skeleton className="h-10 w-40 mb-8" />

      {/* User info card */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/20 shadow-sm p-6 flex items-center gap-5 mb-8">
        <Skeleton className="h-14 w-14 rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-40 mb-1.5" />
          <Skeleton className="h-4 w-52 mb-2" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      {/* Password card */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/20 shadow-sm p-6">
        <Skeleton className="h-5 w-32 mb-1.5" />
        <Skeleton className="h-4 w-64 mb-5" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
