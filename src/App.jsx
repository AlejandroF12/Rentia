import { useState } from 'react'
import 'tailwindcss'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar temporal de prueba */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-wider text-blue-500">RENTIA</span>
          <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">B2B Portal</span>
        </div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-300">
          <a href="#catalogo" className="hover:text-blue-400 transition-colors">Catálogo</a>
          <a href="#como-funciona" className="hover:text-blue-400 transition-colors">¿Cómo Funciona?</a>
          <a href="#contacto" className="hover:text-blue-400 transition-colors">Contacto Directo</a>
        </nav>
        <div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-600/20 cursor-pointer">
            Acceso Empresas
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Plataforma de intermediación y alquiler B2B sin pasarela de pagos
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Alquiler directo de equipo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">industrial, agrícola y de transporte</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Conecta directamente con proveedores verificados, negocia condiciones a medida y gestiona tu flota con total transparencia y reputación.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer">
              Explorar Catálogo de Equipos
            </button>
            <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-medium rounded-xl transition-all cursor-pointer">
              Registrar mi Empresa
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Rentia &copy; 2026 - Proyecto Académico / Portafolio Profesional
      </footer>
    </div>
  )
}

export default App