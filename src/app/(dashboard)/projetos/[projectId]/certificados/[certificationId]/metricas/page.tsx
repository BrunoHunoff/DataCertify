import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/ui/StatCard'
import { MetricCard } from '@/components/metrics/MetricCard'
import { NewMetricModal } from '@/components/metrics/NewMetricModal'

interface Props {
  params: Promise<{ projectId: string; certificationId: string }>
}

export default async function MetricasPage({ params }: Props) {
  const { projectId, certificationId } = await params

  const [project, certification] = await Promise.all([
    prisma.project.findUnique({ where: { id: projectId } }),
    prisma.certification.findUnique({ where: { id: certificationId } }),
  ])

  if (!project || !certification) notFound()

  const metrics = await prisma.metric.findMany({
    where: { projectId, certificationId },
    include: {
      certification: true,
      entries: {
        include: { loggedBy: true },
        orderBy: { date: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalEntries = metrics.reduce((sum, m) => sum + m.entries.length, 0)

  return (
    <div className="px-8 md:px-12 py-10 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-[#737686] uppercase tracking-wider mb-8">
        <Link href="/" className="hover:text-[#004ac6] transition-colors">
          Projetos
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/projetos/${projectId}/certificados`}
          className="hover:text-[#004ac6] transition-colors"
        >
          {project.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#131b2e]">{certification.name}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#131b2e]">Métricas</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#004ac6] mb-1">
            {certification.name}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tighter text-[#131b2e] mb-2">
            Métricas
          </h2>
          <p className="text-sm text-[#737686] max-w-2xl">
            Defina métricas de conformidade e registre lançamentos com evidências
            para auditoria desta certificação.
          </p>
        </div>
        <NewMetricModal
          projectId={projectId}
          certificationId={certificationId}
        />
      </div>

      {/* Metric cards */}
      {metrics.length === 0 ? (
        <div className="text-center py-20 text-[#737686]">
          <p className="text-sm font-semibold">Nenhuma métrica definida</p>
          <p className="text-xs mt-1">
            Clique em &quot;Nova Métrica&quot; para criar a primeira.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              projectId={projectId}
              certificationId={certificationId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
