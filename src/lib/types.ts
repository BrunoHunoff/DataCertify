import type {
  Certification,
  CertStatus,
  File,
  Metric,
  Project,
  ProjectCertification,
  Role,
  User,
} from '@prisma/client'

export type { CertStatus, Role }

export type ProjectWithCounts = Project & {
  _count: { certifications: number }
}

export type ProjectWithCertifications = Project & {
  certifications: (ProjectCertification & { certification: Certification })[]
  _count: { certifications: number }
}

export type MetricWithRelations = Metric & {
  files: File[]
  loggedBy: User
  certification: Certification | null
}

export type CertificationWithProjects = Certification & {
  projects: ProjectCertification[]
}

export type MetricUnit = 'tons' | 'm³' | 'kg' | 'MWh' | 'L' | 'kWh'
