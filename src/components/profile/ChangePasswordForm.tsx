'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { updatePasswordAction } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await updatePasswordAction(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Senha atualizada com sucesso!')
        form.reset()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
          Nova Senha *
        </Label>
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
          className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
          Confirmar Nova Senha *
        </Label>
        <Input
          name="confirm"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
          className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="bg-[#004ac6] hover:bg-[#003ea8] text-white shadow-md shadow-[#004ac6]/20"
      >
        {isPending ? 'Salvando...' : 'Atualizar Senha'}
      </Button>
    </form>
  )
}
