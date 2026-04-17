import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })

  const roleLabel = dbUser?.role === 'ADMIN' ? 'Administrador' : 'Engenheiro'
  const initials = (dbUser?.name ?? user.email ?? '')
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="px-8 md:px-12 py-10 max-w-2xl mx-auto">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#004ac6] mb-1">
        Conta
      </p>
      <h2 className="text-3xl font-extrabold tracking-tighter text-[#131b2e] mb-8">
        Meu Perfil
      </h2>

      {/* User info card */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/20 shadow-sm p-6 flex items-center gap-5 mb-8">
        <div className="w-14 h-14 rounded-full bg-[#004ac6] flex items-center justify-center shrink-0">
          <span className="text-white text-lg font-bold">{initials}</span>
        </div>
        <div>
          <p className="text-base font-bold text-[#131b2e]">{dbUser?.name ?? '—'}</p>
          <p className="text-sm text-[#737686]">{user.email}</p>
          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest bg-[#dae2fd] text-[#004ac6] px-2 py-0.5 rounded-full">
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Password change */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/20 shadow-sm p-6">
        <h3 className="text-sm font-bold text-[#131b2e] mb-1">Alterar Senha</h3>
        <p className="text-xs text-[#737686] mb-5">
          Digite a nova senha. Mínimo de 6 caracteres.
        </p>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
