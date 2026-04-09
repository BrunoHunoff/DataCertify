import { redirect } from 'next/navigation'
import { Shield, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { InviteUserModal } from '@/components/admin/InviteUserModal'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function UsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Only ADMINs can access this page
  const currentUser = await prisma.user.findUnique({
    where: { email: user.email! },
  })

  if (!currentUser || currentUser.role !== 'ADMIN') {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className="px-8 md:px-12 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-[#131b2e] mb-1">
            Gerenciamento de Usuários
          </h2>
          <p className="text-sm text-[#737686]">
            Crie e gerencie os colaboradores com acesso à plataforma.
          </p>
        </div>
        <InviteUserModal />
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/20 shadow-sm overflow-hidden">
        <div className="bg-[#dae2fd] px-8 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#434655]">
            Colaboradores Cadastrados — {users.length} usuário{users.length !== 1 ? 's' : ''}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#c3c6d7]/30 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                  Nome
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                  E-mail
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                  Perfil
                </TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-[#737686] px-8">
                  Cadastrado em
                </TableHead>
                <TableHead className="px-8 text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isSelf = u.id === currentUser.id
                const isAdmin = u.role === 'ADMIN'

                return (
                  <TableRow
                    key={u.id}
                    className="border-[#c3c6d7]/20 hover:bg-[#f2f3ff] transition-colors group"
                  >
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#004ac6]/10 flex items-center justify-center">
                          {isAdmin ? (
                            <Shield className="w-4 h-4 text-[#004ac6]" />
                          ) : (
                            <User className="w-4 h-4 text-[#737686]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#131b2e]">{u.name}</p>
                          {isSelf && (
                            <p className="text-[10px] text-[#004ac6] font-semibold">
                              Você
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5 text-sm text-[#434655]">
                      {u.email}
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                          isAdmin
                            ? 'bg-[#dbe1ff] text-[#003ea8]'
                            : 'bg-[#f2f3ff] text-[#434655]'
                        }`}
                      >
                        {isAdmin ? 'Administrador' : 'Engenheiro'}
                      </span>
                    </TableCell>
                    <TableCell className="px-8 py-5 text-sm text-[#737686]">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      {!isSelf && (
                        <DeleteUserButton userId={u.id} userName={u.name} />
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
