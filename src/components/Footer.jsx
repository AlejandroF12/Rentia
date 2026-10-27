import Rentia_logo from '../assets/Rentia_logo.webp'

export const Footer = () => {
    return (
        <footer className='w-full px-4 py-8 sm:px-8 lg:px-16'>
            <div className='mx-auto w-full max-w-[90rem]'>
                <div className='grid grid-cols-1 items-center gap-4 sm:grid-cols-3'>
                    <img className='h-auto w-[6.25rem] sm:w-[7.5rem]' src={Rentia_logo} alt='Logo de Rentia' />
                    <p className='text-body text-text-muted text-center'>La fuerza de nuestra región, más cerca.</p>
                    <p className='text-small text-text-muted text-end'>Hecho en Casanare</p>
                </div>
                <div className='mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='text-caption text-text-muted'>
                        &copy; Rentia
                    </p>
                    <div className='text-caption text-text-muted flex gap-[0.625rem]'>
                        <a href='#' className='hover:underline'>Privacidad</a>
                        <a href='#' className='hover:underline'>Terminos</a>
                        <a href='#' className='hover:underline'>Ayuda</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
