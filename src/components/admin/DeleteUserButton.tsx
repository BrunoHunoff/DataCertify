'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { deleteUserAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

interface DeleteUserButtonProps {
  userId: string
  userName: string
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Excluir o usuário "${userName}"? Esta ação não pode ser desfeita.`))
      return

    startTransition(async () => {
      const result = await deleteUserAction(userId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Usuário "${userName}" removido.`)
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
      className="text-[#737686] hover:text-[#ba1a1a] h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
