import { redirect } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/layout/Header'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  })

  const userName = dbUser?.name ?? user.email ?? 'Usuário'
  const userRole = dbUser?.role ?? 'ENGINEER'
  const isAdmin = userRole === 'ADMIN'

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <Header userName={userName} userRole={userRole} isAdmin={isAdmin} />
      <main className="pt-16">{children}</main>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
