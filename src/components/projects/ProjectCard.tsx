import Link from 'next/link'
import Image from 'next/image'
import { MapPin, BadgeCheck } from 'lucide-react'
import type { ProjectWithCounts } from '@/lib/types'

interface ProjectCardProps {
  project: ProjectWithCounts
}

const STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluída',
  PAUSED: 'Pausada',
}

const STATUS_COLORS: Record<string, string> = {
  IN_PROGRESS: 'bg-[#dbe1ff] text-[#003ea8]',
  COMPLETED: 'bg-green-100 text-green-800',
  PAUSED: 'bg-[#ffdbcd] text-[#7d2d00]',
}

export function ProjectCard({ project }: ProjectCardProps) {
  const certCount = project._count.certifications
  const statusClass = STATUS_COLORS[project.status] ?? 'bg-gray-100 text-gray-600'

  return (
    <Link
      href={`/projetos/${project.id}/certificados`}
      className="group block bg-white rounded-xl overflow-hidden border border-[#c3c6d7]/30 shadow-sm hover:shadow-xl hover:border-[#004ac6]/20 transition-all duration-300"
    >
      {/* Image */}
      <div className="h-44 relative overflow-hidden bg-[#eaedff]">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl text-[#004ac6]/20 font-bold tracking-tighter select-none">
              {project.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        {/* Status pill */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusClass}`}
        >
          {STATUS_LABELS[project.status] ?? project.status}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-base font-bold text-[#131b2e] mb-1 group-hover:text-[#004ac6] transition-colors">
          {project.name}
        </h3>
        {project.location && (
          <p className="text-xs text-[#737686] flex items-center gap-1 mb-4">
            <MapPin className="w-3 h-3 shrink-0" />
            {project.location}
          </p>
        )}
        <div className="flex items-center gap-2 pt-4 border-t border-[#c3c6d7]/20">
          <BadgeCheck className="w-4 h-4 text-[#004ac6]" />
          <span className="text-sm font-semibold text-[#131b2e]">
            {certCount === 0
              ? 'Sem certificados'
              : certCount === 1
              ? '1 Certificado'
              : `${certCount} Certificados`}
          </span>
        </div>
      </div>
    </Link>
  )
}
