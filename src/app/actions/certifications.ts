'use server'

import { revalidatePath } from 'next/cache'
import { CertStatus } from '@prisma/client'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function createCertificationAction(
  projectId: string,
  formData: FormData,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const name = (formData.get('name') as string)?.trim()
  const level = (formData.get('level') as string)?.trim() || null
  const description = (formData.get('description') as string)?.trim() || null
  const issuedAtRaw = formData.get('issuedAt') as string | null
  const expiresAtRaw = formData.get('expiresAt') as string | null
  const statusRaw = (formData.get('status') as string) || 'PENDING'

  if (!name) return { error: 'O nome do certificado é obrigatório.' }

  const validStatuses = ['VALID', 'PENDING', 'EXPIRED']
  if (!validStatuses.includes(statusRaw)) return { error: 'Status inválido.' }

  try {
    const certification = await prisma.certification.create({
      data: {
        name,
        level,
        description,
        issuedAt: issuedAtRaw ? new Date(issuedAtRaw) : null,
        expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
        status: statusRaw as CertStatus,
      },
    })

    await prisma.projectCertification.create({
      data: { projectId, certificationId: certification.id },
    })

    revalidatePath(`/projetos/${projectId}/certificados`)
    return { success: true, certificationId: certification.id }
  } catch {
    return { error: 'Erro ao criar certificado.' }
  }
}

export async function deleteCertificationAction(
  certificationId: string,
  projectId: string,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  try {
    await prisma.projectCertification.deleteMany({
      where: { certificationId, projectId },
    })
    revalidatePath(`/projetos/${projectId}/certificados`)
    return { success: true }
  } catch {
    return { error: 'Erro ao remover certificado.' }
  }
}
