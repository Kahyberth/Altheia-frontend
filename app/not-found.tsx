"use client";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 py-16 sm:px-6 lg:px-8">
      {/* Decorative blurred background blob */}
      <div className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 opacity-30 dark:opacity-20 blur-3xl" />

      <div className="mx-auto w-full max-w-2xl text-center">
        <SearchX className="mx-auto h-20 w-20 text-blue-600 dark:text-blue-400" />
        <h1 className="mt-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl">
          404
        </h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700 dark:text-slate-200 md:text-3xl">
          Página no encontrada
        </p>
        <p className="mt-2 text-base text-gray-600 dark:text-slate-400 md:text-lg">
          Lo sentimos, no pudimos encontrar la página que estabas buscando.
        </p>

        <div className="mt-8">
          <Link href="/dashboard">
            <span className="inline-flex items-center gap-2 rounded-md bg-blue-600 dark:bg-blue-500 px-6 py-3 text-base font-medium text-white shadow-lg ring-1 ring-blue-700/10 dark:ring-blue-400/20 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors duration-200">
              Volver al inicio
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
