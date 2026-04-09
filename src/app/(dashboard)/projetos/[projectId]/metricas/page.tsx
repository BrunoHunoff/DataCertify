import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/ui/StatCard'
import { MetricsTable } from '@/components/metrics/MetricsTable'
import { NewMetricModal } from '@/components/metrics/NewMetricModal'

interface Props {
  params: Promise<{ projectId: string }>
}

export default async function MetricasPage({ params }: Props) {
  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })

  if (!project) notFound()

  const [metrics, certifications] = await Promise.all([
    prisma.metric.findMany({
      where: { projectId },
      include: { files: true, loggedBy: true, certification: true },
      orderBy: { dateLogged: 'desc' },
    }),
    prisma.certification.findMany({
      where: { projects: { some: { projectId } } },
      orderBy: { name: 'asc' },
    }),
  ])

  const totalValue = metrics.reduce((sum, m) => sum + m.value, 0)
  const unit = metrics[0]?.unit ?? 'kg'

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
        <span className="text-[#131b2e]">Métricas</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tighter text-[#131b2e] mb-2">
            Resíduos Gerados
          </h2>
          <p className="text-sm text-[#737686] max-w-2xl">
            Registro histórico detalhado da geração e descarte de resíduos da
            construção. Gerencie e audite os lançamentos para conformidade com
            certificações ambientais.
          </p>
        </div>
        <NewMetricModal projectId={projectId} certifications={certifications} />
      </div>

      {/* Stat */}
      <div className="mb-8">
        <StatCard
          title="Total Acumulado"
          value={totalValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          })}
          unit={unit}
          className="max-w-xs"
        />
      </div>

      {/* Table */}
      <MetricsTable metrics={metrics} projectId={projectId} />
    </div>
  )
}
