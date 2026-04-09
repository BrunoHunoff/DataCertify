'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { createProjectAction } from '@/app/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface NewProjectModalProps {
  trigger?: React.ReactNode
}

export function NewProjectModal({ trigger }: NewProjectModalProps = {}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createProjectAction(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Obra criada com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[#004ac6] hover:bg-[#003ea8] text-white shadow-lg shadow-[#004ac6]/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#131b2e]">
            Nova Obra
          </DialogTitle>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#004ac6]">
            Cadastro de Projeto
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Nome da Obra *
            </Label>
            <Input
              name="name"
              placeholder="ex: Edifício Horizon"
              required
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Endereço / Localização
            </Label>
            <Input
              name="location"
              placeholder="ex: Av. Paulista, 1200 — São Paulo, SP"
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
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
              {isPending ? 'Criando...' : 'Criar Obra'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
