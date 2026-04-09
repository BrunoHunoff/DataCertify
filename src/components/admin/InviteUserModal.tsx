'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
import { inviteUserAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function InviteUserModal() {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState('ENGINEER')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('role', role)

    startTransition(async () => {
      const result = await inviteUserAction(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Usuário criado com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[#004ac6] hover:bg-[#003ea8] text-white shadow-lg shadow-[#004ac6]/20 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Convidar Usuário
          </Button>
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#131b2e]">
            Novo Usuário
          </DialogTitle>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#004ac6]">
            Acesso será criado imediatamente
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Nome Completo *
            </Label>
            <Input
              name="name"
              placeholder="João Silva"
              required
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              E-mail *
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="joao@empresa.com"
              required
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Senha Inicial *
            </Label>
            <Input
              name="password"
              type="password"
              placeholder="mín. 6 caracteres"
              required
              minLength={6}
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Perfil de Acesso *
            </Label>
            <Select value={role} onValueChange={(v) => { if (v) setRole(v) }}>
              <SelectTrigger className="bg-[#f2f3ff] border-none w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ENGINEER">
                  Engenheiro — Visualiza e lança dados
                </SelectItem>
                <SelectItem value="ADMIN">
                  Administrador — Acesso total + convidar usuários
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-[#ffdbcd]/50 border border-[#ffdbcd] p-3 text-xs text-[#7d2d00]">
            <strong>Atenção:</strong> o usuário receberá as credenciais de acesso.
            Oriente-o a trocar a senha no primeiro acesso.
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              className="flex-1 bg-[#eaedff] text-[#394c84] hover:bg-[#dbe1ff]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-[2] bg-[#004ac6] hover:bg-[#003ea8] text-white shadow-md shadow-[#004ac6]/20"
            >
              {isPending ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
