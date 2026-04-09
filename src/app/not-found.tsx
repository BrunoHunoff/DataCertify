import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center justify-center text-center px-4">
      <p className="text-7xl font-extrabold tracking-tighter text-[#dbe1ff] mb-4">404</p>
      <h1 className="text-2xl font-bold text-[#131b2e] mb-2">Página não encontrada</h1>
      <p className="text-sm text-[#737686] mb-8">
        O recurso que você procura não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold rounded-lg shadow-md transition-colors"
      >
        Voltar para o início
      </Link>
    </div>
  )
}
