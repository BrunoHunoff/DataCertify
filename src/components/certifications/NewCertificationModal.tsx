'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { PlusCircle } from 'lucide-react'
import { createCertificationAction } from '@/app/actions/certifications'
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

interface NewCertificationModalProps {
  projectId: string
}

export function NewCertificationModal({ projectId }: NewCertificationModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('status', 'PENDING')

    startTransition(async () => {
      const result = await createCertificationAction(projectId, formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Certificado adicionado!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[#004ac6] hover:bg-[#003ea8] text-white shadow-lg shadow-[#004ac6]/20 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Novo Certificado
          </Button>
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#131b2e]">
            Novo Certificado
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Nome *
            </Label>
            <Input
              name="name"
              placeholder="ex: Alvará de Construção"
              required
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Nível / Órgão Emissor
            </Label>
            <Input
              name="level"
              placeholder="ex: Municipal, Estadual, LEED Gold"
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
                Data de Emissão
              </Label>
              <Input
                name="issuedAt"
                type="date"
                className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
                Data de Validade
              </Label>
              <Input
                name="expiresAt"
                type="date"
                className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
              />
            </div>
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
              {isPending ? 'Salvando...' : 'Salvar Certificado'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
