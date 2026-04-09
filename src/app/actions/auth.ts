'use server'

import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function inviteUserAction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  // Check caller is ADMIN
  const caller = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!caller || caller.role !== 'ADMIN') {
    return { error: 'Acesso negado. Apenas administradores podem convidar usuários.' }
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const name = (formData.get('name') as string)?.trim()
  const role = (formData.get('role') as string) === 'ADMIN' ? Role.ADMIN : Role.ENGINEER
  const password = formData.get('password') as string

  if (!email || !name || !password) {
    return { error: 'Preencha todos os campos obrigatórios.' }
  }

  if (password.length < 6) {
    return { error: 'A senha deve ter pelo menos 6 caracteres.' }
  }

  try {
    // Create auth user via service role
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (authError) {
      if (authError.message.includes('already')) {
        return { error: 'Já existe um usuário com este e-mail.' }
      }
      return { error: authError.message }
    }

    // Mirror in database
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        name,
        role,
      },
    })

    return { success: true }
  } catch {
    return { error: 'Erro ao criar usuário. Tente novamente.' }
  }
}

export async function deleteUserAction(userId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const caller = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!caller || caller.role !== 'ADMIN') {
    return { error: 'Acesso negado.' }
  }

  if (caller.id === userId) {
    return { error: 'Você não pode excluir sua própria conta.' }
  }

  try {
    await supabaseAdmin.auth.admin.deleteUser(userId)
    await prisma.user.delete({ where: { id: userId } })
    return { success: true }
  } catch {
    return { error: 'Erro ao excluir usuário.' }
  }
}
