'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Pencil, Plus } from 'lucide-react'
import { createMetricAction, updateMetricAction } from '@/app/actions/metrics'
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
import type { Metric } from '@prisma/client'

interface NewMetricModalProps {
  projectId: string
  certificationId: string
  /** Pass to open in edit mode */
  metric?: Metric
}

export function NewMetricModal({ projectId, certificationId, metric }: NewMetricModalProps) {
  const isEdit = !!metric
  const [open, setOpen] = useState(false)
  const [unit, setUnit] = useState(metric?.unit ?? 'kg')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('unit', unit)

    startTransition(async () => {
      const result = isEdit
        ? await updateMetricAction(metric!.id, projectId, certificationId, formData)
        : await createMetricAction(projectId, certificationId, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(isEdit ? 'Métrica atualizada!' : 'Métrica criada!')
        if (!isEdit) { setUnit('kg'); form.reset() }
        setOpen(false)
      }
    })
  }

  const trigger = isEdit ? (
    <Button
      variant="ghost"
      size="sm"
      className="text-[#737686] hover:text-[#004ac6] h-7 w-7 p-0"
      title="Editar métrica"
    >
      <Pencil className="w-3.5 h-3.5" />
    </Button>
  ) : (
    <Button className="bg-[#004ac6] hover:bg-[#003ea8] text-white shadow-lg shadow-[#004ac6]/20 flex items-center gap-2">
      <Plus className="w-4 h-4" />
      Nova Métrica
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#131b2e]">
            {isEdit ? 'Editar Métrica' : 'Nova Métrica'}
          </DialogTitle>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#004ac6]">
            Definição de Métrica
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Nome da Métrica *
            </Label>
            <Input
              name="name"
              defaultValue={metric?.name}
              placeholder="ex: Madeira, Concreto, CO₂..."
              required
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          {/* Goal + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
                Meta *
              </Label>
              <Input
                name="goal"
                type="number"
                step="0.01"
                min="0"
                defaultValue={metric?.goal}
                placeholder="0,00"
                required
                className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
                Unidade *
              </Label>
              <Select value={unit} onValueChange={(v) => { if (v) setUnit(v) }}>
                <SelectTrigger className="bg-[#f2f3ff] border-none w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="tons">tons</SelectItem>
                  <SelectItem value="m³">m³</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="kWh">kWh</SelectItem>
                  <SelectItem value="MWh">MWh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
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
              {isPending ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar Métrica'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
