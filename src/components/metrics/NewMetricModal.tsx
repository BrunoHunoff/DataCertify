'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { createMetricAction } from '@/app/actions/metrics'
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
import { FileUploadZone } from './FileUploadZone'
import type { Certification } from '@prisma/client'

interface NewMetricModalProps {
  projectId: string
  certifications: Certification[]
}

interface UploadedFile {
  fileUrl: string
  fileName: string
  fileType: string
}

export function NewMetricModal({ projectId, certifications }: NewMetricModalProps) {
  const [open, setOpen] = useState(false)
  const [unit, setUnit] = useState('kg')
  const [certificationId, setCertificationId] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isPending, startTransition] = useTransition()

  function resetForm() {
    setUnit('kg')
    setCertificationId('')
    setUploadedFile(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('unit', unit)
    formData.set('certificationId', certificationId)

    if (uploadedFile) {
      formData.set('fileUrl', uploadedFile.fileUrl)
      formData.set('fileName', uploadedFile.fileName)
      formData.set('fileType', uploadedFile.fileType)
    }

    startTransition(async () => {
      const result = await createMetricAction(projectId, formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Lançamento salvo com sucesso!')
        resetForm()
        form.reset()
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger
        render={
          <Button className="bg-[#004ac6] hover:bg-[#003ea8] text-white shadow-lg shadow-[#004ac6]/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Lançamento
          </Button>
        }
      />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#131b2e]">
            Novo Lançamento
          </DialogTitle>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#004ac6]">
            Resíduos Gerados • Lançamento de Métrica
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
                Quantidade *
              </Label>
              <Input
                name="value"
                type="number"
                step="0.01"
                min="0"
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

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Descrição / Tipo de Material
            </Label>
            <Input
              name="description"
              placeholder="ex: Resíduos de Concreto"
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
              Data do Lançamento *
            </Label>
            <Input
              name="dateLogged"
              type="date"
              required
              className="bg-[#f2f3ff] border-none focus-visible:ring-[#004ac6]/30"
            />
          </div>

          {/* Certification (optional) */}
          {certifications.length > 0 && (
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#434655]">
                Certificação Vinculada (opcional)
              </Label>
              <Select value={certificationId} onValueChange={(v) => setCertificationId(v ?? '')}>
                <SelectTrigger className="bg-[#f2f3ff] border-none w-full">
                  <SelectValue placeholder="Selecionar certificação..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {certifications.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* File upload */}
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
              {isPending ? 'Salvando...' : 'Salvar Lançamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
