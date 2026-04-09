'use client'

import { useRef, useState } from 'react'
import { CloudUpload, FileCheck2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface FileUploadZoneProps {
  onUpload: (result: { fileUrl: string; fileName: string; fileType: string }) => void
  onClear: () => void
  projectId: string
  uploaded: boolean
  uploadedName?: string
}

export function FileUploadZone({
  onUpload,
  onClear,
  projectId,
  uploaded,
  uploadedName,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  async function uploadFile(file: File) {
    const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
    const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

    if (file.size > MAX_SIZE) {
      setError('Arquivo muito grande. Máximo 10 MB.')
      return
    }
    if (!ALLOWED.includes(file.type)) {
      setError('Formato não suportado. Use PDF, JPG ou PNG.')
      return
    }

    setError(null)
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from('evidencias')
      .upload(path, file, { upsert: false })

    setUploading(false)

    if (uploadError) {
      setError('Erro ao fazer upload. Tente novamente.')
      return
    }

    const { data: urlData } = supabase.storage
      .from('evidencias')
      .getPublicUrl(data.path)

    onUpload({
      fileUrl: urlData.publicUrl,
      fileName: file.name,
      fileType: file.type,
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  if (uploaded && uploadedName) {
    return (
      <div className="flex items-center justify-between bg-[#dbe1ff] rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-[#004ac6]" />
          <span className="text-sm font-semibold text-[#003ea8] truncate max-w-[260px]">
            {uploadedName}
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-[#737686] hover:text-[#ba1a1a] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all',
          isDragOver
            ? 'border-[#004ac6]/60 bg-[#dbe1ff]/40'
            : 'border-[#c3c6d7] bg-[#f2f3ff] hover:border-[#004ac6]/40 hover:bg-[#eaedff]',
        )}
      >
        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
          <CloudUpload className="w-5 h-5 text-[#004ac6]" />
        </div>
        <p className="text-sm font-bold text-[#131b2e] mb-1">
          {uploading ? 'Enviando arquivo...' : 'Arraste e solte o arquivo aqui'}
        </p>
        <p className="text-[10px] text-[#737686] font-medium">
          Suporte: PDF, JPG, PNG (Máx. 10MB)
        </p>
      </div>
      {error && (
        <p className="text-xs text-[#ba1a1a] font-medium mt-1.5">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
