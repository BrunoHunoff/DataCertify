'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function createMetricAction(
  projectId: string,
  formData: FormData,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!dbUser) return { error: 'Usuário não encontrado na base de dados.' }

  const valueRaw = formData.get('value') as string
  const unit = (formData.get('unit') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const dateLoggedRaw = formData.get('dateLogged') as string
  const certificationId = (formData.get('certificationId') as string) || null
  const fileUrl = (formData.get('fileUrl') as string) || null
  const fileName = (formData.get('fileName') as string) || null
  const fileType = (formData.get('fileType') as string) || null

  const value = parseFloat(valueRaw)
  if (isNaN(value) || value < 0) return { error: 'Valor inválido.' }
  if (!unit) return { error: 'Unidade obrigatória.' }
  if (!dateLoggedRaw) return { error: 'Data obrigatória.' }

  try {
    const metric = await prisma.metric.create({
      data: {
        value,
        unit,
        description,
        dateLogged: new Date(dateLoggedRaw),
        projectId,
        certificationId: certificationId || null,
        loggedById: dbUser.id,
      },
    })

    // If a file was uploaded, link it
    if (fileUrl && fileName) {
      await prisma.file.create({
        data: {
          fileName,
          fileUrl,
          fileType: fileType ?? 'application/octet-stream',
          projectId,
          metricId: metric.id,
        },
      })
    }

    revalidatePath(`/projetos/${projectId}/metricas`)
    return { success: true }
  } catch {
    return { error: 'Erro ao salvar lançamento.' }
  }
}

export async function deleteMetricAction(metricId: string, projectId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  try {
    await prisma.metric.delete({ where: { id: metricId } })
    revalidatePath(`/projetos/${projectId}/metricas`)
    return { success: true }
  } catch {
    return { error: 'Erro ao excluir lançamento.' }
  }
}
