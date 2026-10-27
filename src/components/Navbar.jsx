import Rentia_logo from '../assets/Rentia_logo.webp'
import { MapPin } from 'lucide-react'

const Navbar = () => {
  return (
    <header className='w-full border-b border-border bg-surface px-4 sm:px-8 lg:px-16'>
      <nav className='mx-auto grid min-h-[4.75rem] max-w-[90rem] grid-cols-2 items-center gap-x-4 gap-y-3 py-3 md:min-h-[6rem] md:grid-cols-3 md:gap-4 md:py-0'>
        {/*Columna 1 */}
        <div><img className='h-auto w-[6.25rem] sm:w-[7.5rem]' src={Rentia_logo} alt='Logo Rentia' /></div>
        {/* Columna 2 */}
        <div className='order-3 col-span-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-body md:order-none md:col-span-1 md:gap-4 lg:gap-8'>
          <a className='text-center font-semibold text-primary cursor-pointer' href='#catalogo'>
            Explorar equipos
          </a>
          <a className='text-center text-text-muted cursor-pointer' href='#como-funciona'>
            Cómo funciona
          </a>
          <div className='flex items-center'>
            <MapPin className='w-[0.9375rem] shrink-0 text-center text-text-muted' />
            <p className='text-label text-center text-text-muted'>Casanare, Colombia</p>
          </div>
        </div>
        {/* Columna 3 */}
        <div className='flex items-center justify-end gap-3 sm:gap-[1.375rem]'>
          <button className='whitespace-nowrap text-label text-primary cursor-pointer sm:text-body'>Ingresar</button>
          <button className='flex h-[2.625rem] items-center justify-center gap-2 whitespace-nowrap rounded-[0.5rem] bg-primary px-3 text-label font-semibold text-text-inverse cursor-pointer sm:h-[2.875rem] sm:px-[1.125rem]'>
            <span>+</span>
            <span className='hidden sm:inline'>Publicar Equipo</span>
            <span className='sm:hidden'>Publicar</span>
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar