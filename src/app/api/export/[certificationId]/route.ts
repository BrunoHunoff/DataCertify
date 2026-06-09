import { NextRequest } from 'next/server'
import JSZip from 'jszip'
import { prisma } from '@/lib/prisma'

function sanitize(name: string) {
  return name.replace(/\s+/g, '_').replace(/[/\\:*?"<>|]/g, '')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificationId: string }> },
) {
  const { certificationId } = await params
  const projectId = request.nextUrl.searchParams.get('projectId')

  if (!projectId) {
    return new Response('projectId required', { status: 400 })
  }

  const [project, certification] = await Promise.all([
    prisma.project.findUnique({ where: { id: projectId } }),
    prisma.certification.findUnique({ where: { id: certificationId } }),
  ])

  if (!project || !certification) {
    return new Response('Not found', { status: 404 })
  }

  const metrics = await prisma.metric.findMany({
    where: { projectId, certificationId },
    include: {
      entries: {
        where: { fileUrl: { not: null } },
        orderBy: { date: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const zip = new JSZip()

  await Promise.all(
    metrics.map(async (metric) => {
      const folder = zip.folder(sanitize(metric.name))!
      const fileCounters: Record<string, number> = {}

      await Promise.all(
        metric.entries.map(async (entry) => {
          if (!entry.fileUrl || !entry.fileName) return

          const dateStr = entry.date.toISOString().split('T')[0]
          const baseName = sanitize(`${dateStr}_${entry.fileName}`)

          // Deduplicate names within the same folder
          fileCounters[baseName] = (fileCounters[baseName] ?? 0) + 1
          const finalName =
            fileCounters[baseName] > 1
              ? baseName.replace(/(\.[^.]+)$/, `_${fileCounters[baseName]}$1`)
              : baseName

          try {
            const res = await fetch(entry.fileUrl)
            if (!res.ok) return
            const buffer = await res.arrayBuffer()
            folder.file(finalName, buffer)
          } catch {
            // skip unreachable files
          }
        }),
      )
    }),
  )

  const zipName = `${sanitize(project.name)}_${sanitize(certification.name)}.zip`
  const content = await zip.generateAsync({ type: 'arraybuffer' })

  return new Response(content, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipName}"`,
    },
  })
}
