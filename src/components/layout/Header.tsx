'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Settings, UserCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface HeaderProps {
  userName: string
  userRole: string
  isAdmin: boolean
}

export function Header({ userName, userRole, isAdmin }: HeaderProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const roleLabel = userRole === 'ADMIN' ? 'Administrador' : 'Engenheiro'

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-white border-b border-[#c3c6d7]/40 shadow-sm flex items-center justify-between px-8">
      {/* Left: brand */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tighter text-[#131b2e]">
            Obra Limpa
          </h1>
        </Link>
      </div>

      {/* Right: user menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity outline-none cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#131b2e]">{userName}</p>
                <p className="text-[10px] text-[#737686] uppercase tracking-widest">
                  {roleLabel}
                </p>
              </div>
              <Avatar className="w-9 h-9 border-2 border-[#dbe1ff]">
                <AvatarFallback className="bg-[#004ac6] text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          }
        />

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {isAdmin && (
            <DropdownMenuItem
              render={
                <Link href="/admin/usuarios" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  Gerenciar Usuários
                </Link>
              }
            />
          )}
          <DropdownMenuItem
            render={
              <Link href="/perfil" className="flex items-center gap-2 cursor-pointer">
                <UserCircle2 className="w-4 h-4" />
                Meu Perfil
              </Link>
            }
          />
          <DropdownMenuItem
            onClick={handleSignOut}
            variant="destructive"
            className="flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
