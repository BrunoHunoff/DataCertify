import type {
  Certification,
  CertStatus,
  File,
  Metric,
  MetricEntry,
  Project,
  ProjectCertification,
  Role,
  User,
} from '@prisma/client'

export type { CertStatus, Role, File }

export type ProjectWithCounts = Project & {
  _count: { certifications: number }
}

export type ProjectWithCertifications = Project & {
  certifications: (ProjectCertification & { certification: Certification })[]
  _count: { certifications: number }
}

export type MetricEntryWithRelations = MetricEntry & {
  loggedBy: User
}

export type MetricWithEntries = Metric & {
  entries: MetricEntryWithRelations[]
  certification: Certification | null
}

export type CertificationWithProjects = Certification & {
  projects: ProjectCertification[]
}

export type MetricUnit = 'tons' | 'm³' | 'kg' | 'MWh' | 'L' | 'kWh'
