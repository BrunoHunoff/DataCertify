'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface DownloadAllButtonProps {
  projectId: string
  certificationId: string
}

export function DownloadAllButton({ projectId, certificationId }: DownloadAllButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const url = `/api/export/${certificationId}?projectId=${projectId}`
      const res = await fetch(url)
      if (!res.ok) {
        toast.error('Erro ao gerar o arquivo ZIP.')
        return
      }
      const blob = await res.blob()
      const disposition = res.headers.get('Content-Disposition') ?? ''
      const match = disposition.match(/filename="([^"]+)"/)
      const fileName = match?.[1] ?? 'export.zip'

      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = fileName
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      toast.error('Erro ao baixar os arquivos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      className="bg-[#eaedff] text-[#394c84] hover:bg-[#dbe1ff] flex items-center gap-1.5"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      {loading ? 'Gerando ZIP...' : 'Baixar tudo'}
    </Button>
  )
}
