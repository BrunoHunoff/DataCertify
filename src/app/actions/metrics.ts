'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ?? null
}

async function getDbUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email!,
      name: (user.user_metadata?.name as string | undefined) ?? user.email!,
      role: 'ENGINEER',
    },
    update: {},
  })
}

function revalidate(projectId: string, certificationId: string) {
  revalidatePath(`/projetos/${projectId}/certificados/${certificationId}/metricas`)
}

// ─── Metric (definition) ────────────────────────────────────────────────────

export async function createMetricAction(
  projectId: string,
  certificationId: string,
  formData: FormData,
) {
  const authUser = await getAuthUser()
  if (!authUser) return { error: 'Não autenticado' }

  const name = (formData.get('name') as string)?.trim()
  const unit = (formData.get('unit') as string)?.trim()
  const goalRaw = formData.get('goal') as string

  if (!name) return { error: 'Nome obrigatório.' }
  if (!unit) return { error: 'Unidade obrigatória.' }
  const goal = parseFloat(goalRaw)
  if (isNaN(goal) || goal < 0) return { error: 'Meta inválida.' }

  try {
    await prisma.metric.create({
      data: { name, goal, unit, projectId, certificationId },
    })
    revalidate(projectId, certificationId)
    return { success: true }
  } catch {
    return { error: 'Erro ao criar métrica.' }
  }
}

export async function updateMetricAction(
  metricId: string,
  projectId: string,
  certificationId: string,
  formData: FormData,
) {
  const authUser = await getAuthUser()
  if (!authUser) return { error: 'Não autenticado' }

  const name = (formData.get('name') as string)?.trim()
  const unit = (formData.get('unit') as string)?.trim()
  const goalRaw = formData.get('goal') as string

  if (!name) return { error: 'Nome obrigatório.' }
  if (!unit) return { error: 'Unidade obrigatória.' }
  const goal = parseFloat(goalRaw)
  if (isNaN(goal) || goal < 0) return { error: 'Meta inválida.' }

  try {
    await prisma.metric.update({
      where: { id: metricId },
      data: { name, goal, unit },
    })
    revalidate(projectId, certificationId)
    return { success: true }
  } catch {
    return { error: 'Erro ao atualizar métrica.' }
  }
}

export async function deleteMetricAction(
  metricId: string,
  projectId: string,
  certificationId: string,
) {
  const authUser = await getAuthUser()
  if (!authUser) return { error: 'Não autenticado' }

  try {
    await prisma.metric.delete({ where: { id: metricId } })
    revalidate(projectId, certificationId)
    return { success: true }
  } catch {
    return { error: 'Erro ao excluir métrica.' }
  }
}

// ─── MetricEntry (lançamento) ────────────────────────────────────────────────

export async function createMetricEntryAction(
  metricId: string,
  projectId: string,
  certificationId: string,
  formData: FormData,
) {
  const dbUser = await getDbUser()
  if (!dbUser) return { error: 'Não autenticado' }

  const quantityRaw = formData.get('quantity') as string
  const dateRaw = formData.get('date') as string
  const fileUrl = (formData.get('fileUrl') as string) || null
  const fileName = (formData.get('fileName') as string) || null
  const fileType = (formData.get('fileType') as string) || null

  const quantity = parseFloat(quantityRaw)
  if (isNaN(quantity) || quantity < 0) return { error: 'Quantidade inválida.' }
  if (!dateRaw) return { error: 'Data obrigatória.' }

  try {
    await prisma.metricEntry.create({
      data: {
        quantity,
        date: new Date(dateRaw),
        metricId,
        loggedById: dbUser.id,
        fileUrl,
        fileName,
        fileType,
      },
    })
    revalidate(projectId, certificationId)
    return { success: true }
  } catch {
    return { error: 'Erro ao salvar lançamento.' }
  }
}

export async function updateMetricEntryAction(
  entryId: string,
  projectId: string,
  certificationId: string,
  formData: FormData,
) {
  const authUser = await getAuthUser()
  if (!authUser) return { error: 'Não autenticado' }

  const quantityRaw = formData.get('quantity') as string
  const dateRaw = formData.get('date') as string
  const fileUrl = (formData.get('fileUrl') as string) || null
  const fileName = (formData.get('fileName') as string) || null
  const fileType = (formData.get('fileType') as string) || null

  const quantity = parseFloat(quantityRaw)
  if (isNaN(quantity) || quantity < 0) return { error: 'Quantidade inválida.' }
  if (!dateRaw) return { error: 'Data obrigatória.' }

  try {
    await prisma.metricEntry.update({
      where: { id: entryId },
      data: { quantity, date: new Date(dateRaw), fileUrl, fileName, fileType },
    })
    revalidate(projectId, certificationId)
    return { success: true }
  } catch {
    return { error: 'Erro ao atualizar lançamento.' }
  }
}

export async function deleteMetricEntryAction(
  entryId: string,
  projectId: string,
  certificationId: string,
) {
  const authUser = await getAuthUser()
  if (!authUser) return { error: 'Não autenticado' }

  try {
    await prisma.metricEntry.delete({ where: { id: entryId } })
    revalidate(projectId, certificationId)
    return { success: true }
  } catch {
    return { error: 'Erro ao excluir lançamento.' }
  }
}
