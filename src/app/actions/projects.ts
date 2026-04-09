'use server'

import { revalidatePath } from 'next/cache'
import { ProjectStatus } from '@prisma/client'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const name = (formData.get('name') as string)?.trim()
  const location = (formData.get('location') as string)?.trim()
  const imageUrl = (formData.get('imageUrl') as string)?.trim() || null

  if (!name) return { error: 'O nome da obra é obrigatório.' }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        location: location || null,
        imageUrl,
        status: ProjectStatus.IN_PROGRESS,
      },
    })
    revalidatePath('/')
    return { success: true, projectId: project.id }
  } catch {
    return { error: 'Erro ao criar projeto.' }
  }
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const name = (formData.get('name') as string)?.trim()
  const location = (formData.get('location') as string)?.trim()

  if (!name) return { error: 'O nome da obra é obrigatório.' }

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { name, location: location || null },
    })
    revalidatePath('/')
    revalidatePath(`/projetos/${projectId}/certificados`)
    return { success: true }
  } catch {
    return { error: 'Erro ao atualizar projeto.' }
  }
}
