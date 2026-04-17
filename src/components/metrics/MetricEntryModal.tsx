'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Pencil, Plus } from 'lucide-react'
import { createMetricEntryAction, updateMetricEntryAction } from '@/app/actions/metrics'
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
import { FileUploadZone } from './FileUploadZone'
import type { MetricEntry } from '@prisma/client'

interface MetricEntryModalProps {
  metricId: string
  projectId: string
  certificationId: string
  unit: string
  /** Pass to open in edit mode */
  entry?: MetricEntry
}

interface UploadedFile {
  fileUrl: string
  fileName: string
  fileType: string
}

export function MetricEntryModal({
  metricId,
  projectId,
  certificationId,
  unit,
  entry,
}: MetricEntryModalProps) {
  const isEdit = !!entry
  const [open, setOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(
    entry?.fileUrl ? { fileUrl: entry.fileUrl, fileName: entry.fileName ?? '', fileType: entry.fileType ?? '' } : null
  )
  const [isPending, startTransition] = useTransition()

  function resetForm() {
    if (!isEdit) setUploadedFile(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    if (uploadedFile) {
      formData.set('fileUrl', uploadedFile.fileUrl)
      formData.set('fileName', uploadedFile.fileName)
      formData.set('fileType', uploadedFile.fileType)
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateMetricEntryAction(entry!.id, projectId, certificationId, formData)
        : await createMetricEntryAction(metricId, projectId, certificationId, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(isEdit ? 'Lançamento atualizado!' : 'Lançamento salvo!')
        resetForm()
        form.reset()
        setOpen(false)
      }
    })
  }

  // Format date for input default value
  const defaultDate = entry?.date
    ? new Date(entry.date).toISOString().split('T')[0]
    : ''

  const trigger = isEdit ? (
    <Button
      variant="ghost"
      size="sm"
      className="text-[#737686] hover:text-[#004ac6] h-7 w-7 p-0"
      title="Editar lançamento"
    >
      <Pencil className="w-3.5 h-3.5" />
    </Button>
  ) : (
    <Button
      size="sm"
      className="bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs flex items-center gap-1.5 shadow-sm shadow-[#004ac6]/20"
    >
      <Plus className="w-3.5 h-3.5" />
      Novo Lançamento
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#131b2e]">
            {isEdit ? 'Editar Lançamento' : 'Novo Lançamento'}
          </DialogTitle>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#004ac6]">
            Lançamento de Métrica
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Quantity */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Quantidade ({unit}) *
            </Label>
            <Input
              name="quantity"
              type="number"
              step="0.01"
              min="0"
              defaultValue={entry?.quantity}
              placeholder="0,00"
              required
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Data *
            </Label>
            <Input
              name="date"
              type="date"
              defaultValue={defaultDate}
              required
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          {/* File */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Nota Fiscal / Documento
            </Label>
            <FileUploadZone
              projectId={projectId}
              uploaded={!!uploadedFile}
              uploadedName={uploadedFile?.fileName}
              onUpload={(result) => setUploadedFile(result)}
              onClear={() => setUploadedFile(null)}
            />
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
              {isPending ? 'Salvando...' : isEdit ? 'Atualizar' : 'Salvar Lançamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
