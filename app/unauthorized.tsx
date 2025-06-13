import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          401 – No autorizado
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          No tienes permiso para acceder a esta página.
        </p>
        <div className="mt-6">
          <Link href="/">
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Ir al inicio
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
