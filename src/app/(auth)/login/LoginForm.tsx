'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('Credenciais inválidas. Verifique seu e-mail e senha.')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      {/* Brand */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tighter text-[#131b2e]">
          Obra Limpa
        </h1>
        <p className="text-xs font-bold tracking-widest text-[#737686] uppercase mt-1">
          Precision Tectonics
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-[#c3c6d7]/40 shadow-sm p-8">
        <h2 className="text-xl font-bold text-[#131b2e] mb-1">
          Entrar na plataforma
        </h2>
        <p className="text-sm text-[#737686] mb-8">
          Acesso restrito a colaboradores autorizados.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-[#434655]">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-[#434655]">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold py-6 rounded-lg shadow-lg shadow-[#004ac6]/20"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>

      <p className="text-center text-xs text-[#737686] mt-6">
        Sem acesso? Solicite ao administrador do sistema.
      </p>
    </div>
  )
}
