import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/ui/StatCard'
import { CertificationsTable } from '@/components/certifications/CertificationsTable'
import { NewCertificationModal } from '@/components/certifications/NewCertificationModal'


interface Props {
  params: Promise<{ projectId: string }>
}

export default async function CertificadosPage({ params }: Props) {
  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      certifications: {
        include: { certification: true },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { certifications: true } },
    },
  })

  if (!project) notFound()

  return (
    <div className="px-8 md:px-12 py-10 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-[#737686] uppercase tracking-wider mb-8">
        <Link href="/" className="hover:text-[#004ac6] transition-colors">
          Projetos
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#004ac6]">{project.name}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#131b2e]">Certificados</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-[#131b2e] leading-none mb-2">
            {project.name}
          </h2>
          <p className="text-sm text-[#737686]">
            Painel de Ciclo de Vida de Certificação e Conformidade Regulatória
          </p>
        </div>
        <NewCertificationModal projectId={projectId} />
      </div>

      {/* Table */}
      <CertificationsTable
        certifications={project.certifications}
        projectId={projectId}
      />

    </div>
  )
}
