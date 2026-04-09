'use client'

import { PlusCircle } from 'lucide-react'
import { NewProjectModal } from './NewProjectModal'

export function AddProjectCard() {
  return (
    <NewProjectModal trigger={
      <button className="group w-full border-2 border-dashed border-[#c3c6d7] rounded-xl flex flex-col items-center justify-center p-12 hover:border-[#004ac6]/50 hover:bg-[#f2f3ff] transition-all cursor-pointer min-h-[220px]">
        <div className="w-14 h-14 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#737686] group-hover:bg-[#dbe1ff] group-hover:text-[#004ac6] transition-all mb-4">
          <PlusCircle className="w-7 h-7" />
        </div>
        <p className="font-bold text-[#131b2e] text-sm">Iniciar Nova Obra</p>
        <p className="text-xs text-[#737686] mt-1">Configure um novo canteiro</p>
      </button>
    } />
  )
}
