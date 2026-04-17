'use server'

import { createClient } from '@/lib/supabase/server'

export async function updatePasswordAction(formData: FormData) {
  const password = (formData.get('password') as string)?.trim()
  const confirm = (formData.get('confirm') as string)?.trim()

  if (!password || password.length < 6)
    return { error: 'A senha deve ter pelo menos 6 caracteres.' }
  if (password !== confirm)
    return { error: 'As senhas não coincidem.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }
  return { success: true }
}
