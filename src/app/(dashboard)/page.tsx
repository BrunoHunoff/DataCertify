import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/ui/StatCard'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { NewProjectModal } from '@/components/projects/NewProjectModal'

export default async function ProjectsPage() {
  const [projects, totalCount] = await Promise.all([
    prisma.project.findMany({
      include: {
        _count: { select: { certifications: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.count(),
  ])

  return (
    <div className="px-8 md:px-12 py-10 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-[#131b2e] mb-1">
            Projetos Ativos
          </h2>
          <p className="text-sm text-[#737686] max-w-xl">
            Gerencie suas obras com precisão técnica. Monitore o progresso e
            conformidade em tempo real.
          </p>
        </div>
        <NewProjectModal />
      </div>

      {/* Stat */}
      <div className="mb-10">
        <StatCard title="Total de Obras" value={totalCount} className="max-w-[200px]" />
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-24 text-[#737686]">
          <p className="text-lg font-semibold mb-2">Nenhuma obra cadastrada</p>
          <p className="text-sm">Crie a primeira obra clicando em &quot;Novo Projeto&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}

          {/* Add new card */}
          <Link
            href="#"
            className="group border-2 border-dashed border-[#c3c6d7] rounded-xl flex flex-col items-center justify-center p-12 hover:border-[#004ac6]/50 hover:bg-[#f2f3ff] transition-all cursor-pointer min-h-[220px]"
            onClick={(e) => e.preventDefault()}
          >
            <div className="w-14 h-14 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#737686] group-hover:bg-[#dbe1ff] group-hover:text-[#004ac6] transition-all mb-4">
              <PlusCircle className="w-7 h-7" />
            </div>
            <p className="font-bold text-[#131b2e] text-sm">Iniciar Nova Obra</p>
            <p className="text-xs text-[#737686] mt-1">Configure um novo canteiro</p>
          </Link>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-[#c3c6d7]/30 flex flex-col md:flex-row items-center justify-between gap-4 text-[#737686]">
        <p className="text-xs">© 2024 Obra Limpa — Gestão de Precisão Técnica</p>
        <div className="flex gap-6">
          <span className="text-xs">Termos de Serviço</span>
          <span className="text-xs">Privacidade</span>
        </div>
      </footer>
    </div>
  )
}
