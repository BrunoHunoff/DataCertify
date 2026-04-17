import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Download } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/ui/StatCard'
import { CertificationsTable } from '@/components/certifications/CertificationsTable'
import { NewCertificationModal } from '@/components/certifications/NewCertificationModal'
import { Button } from '@/components/ui/button'

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
        {/*<div className="flex gap-3">
          <Button
            variant="secondary"
            className="bg-[#eaedff] text-[#394c84] hover:bg-[#dbe1ff] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
          <NewCertificationModal projectId={projectId} />
        </div>*/}
      </div>

      {/* Table */}
      <CertificationsTable
        certifications={project.certifications}
        projectId={projectId}
      />

      {/* FAB — shortcut to metrics */}
      <Link
        href={`/projetos/${projectId}/metricas`}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#004ac6] text-white rounded-full shadow-2xl shadow-[#004ac6]/40 flex items-center justify-center hover:bg-[#003ea8] hover:scale-110 active:scale-90 transition-all z-50"
        title="Ver Métricas"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
        </svg>
      </Link>
    </div>
  )
}
