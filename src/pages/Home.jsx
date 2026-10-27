import { ArrowUpRight, Disc, Search, MapPin, ListFilter, ArrowRight, TractorIcon, Truck, Sprout, Construction } from 'lucide-react'
import heroImage from '../media/heroImage.webp'
import { EquipmentCard } from '../components/EquipmentCard'

export const Home = () => {
    return (
        <div className='w-full'>
            {/* Hero section */}
            <section className='w-full bg-surface flex flex-col gap-8 items-center px-4 py-8 sm:px-8 sm:py-10 lg:px-16 lg:py-11'>
                {/* Sección 1 */}
                <div className='w-full max-w-[90rem] grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-20'>
                    { /* Contenido del Hero */}
                    <div className='flex w-full max-w-[35rem] flex-col gap-6'>
                        <div className='flex flex-row items-center gap-[0.5rem]'>
                            <div className='w-[1.5rem] h-[2px] bg-success'></div>
                            <span className='text-caption text-success font-semibold'>EL LLANO NOS MUEVE</span>
                        </div>
                        <div>
                            <h1 className='text-hero-mobile md:text-hero-desktop text-text font-semibold leading-tight'>El equipo para hacerlo posible.</h1>
                        </div>
                        <div>
                            <p className='text-body-lg text-text-muted'>Maquinaria y vehículos cerca de ti. Conecta con propietarios y mueve tu próximo proyecto.</p>
                        </div>
                        <div className='flex flex-wrap items-center gap-x-8 gap-y-3'>
                            <div className='flex flex-row items-center gap-[0.25rem]'>
                                <ArrowUpRight className='w-[1rem] h-[1rem] text-primary shrink-0' />
                                <span className='text-small font-medium text-primary'>Contacto directo</span>
                            </div>
                            <div className='flex flex-row items-center gap-[0.25rem]'>
                                <Disc className='w-[1rem] h-[1rem] text-primary shrink-0' />
                                <span className='text-small font-medium text-primary'>Gente de la región</span>
                            </div>
                        </div>
                    </div>
                    { /* Imagen del Hero */}
                    <div className='w-full'>
                        <img src={heroImage} className='w-full aspect-[4/3] max-h-[27.5rem] object-cover rounded-2xl sm:rounded-3xl' alt='Retroexcavadora en Hero section' />
                    </div>
                </div>
                { /* Sección 2: Buscador */}
                <div className='w-full max-w-[90rem] grid grid-cols-1 gap-4 rounded-lg border border-border p-4 shadow-[0px_0.75rem_2.5rem_0px_rgba(21,63,76,0.07)] sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center'>
                    <div className='flex min-w-0 flex-row items-center gap-3 lg:px-4'>
                        <Search className='w-[1.25rem] text-primary shrink-0 font-semibold' />
                        <div className='flex min-w-0 flex-col gap-1'>
                            <label htmlFor='search_equipo' className='text-caption text-primary'>
                                ¿Qué equipo necesitas?
                            </label>
                            <input
                                type='text'
                                id='search_equipo'
                                placeholder='Maquinaria o vehículo'
                                className='w-full min-w-0 text-label text-text-muted focus:outline-none' />
                        </div>
                    </div>
                    <div className='flex min-w-0 flex-row items-center gap-3 border-border sm:border-l sm:pl-4 lg:px-4'>
                        <MapPin className='w-[1.25rem] shrink-0 font-semibold text-primary' />
                        <div className='flex min-w-0 flex-col gap-1'>
                            <label htmlFor='search_ubicacion' className='text-caption text-primary'>
                                Ubicación
                            </label>
                            <input
                                type='text'
                                id='search_ubicacion'
                                placeholder='Yopal, Casanare'
                                className='w-full min-w-0 text-label text-text-muted focus:outline-none' />
                        </div>
                    </div>
                    <div className='flex min-w-0 flex-row items-center gap-3 border-border sm:border-t sm:pt-4 lg:border-l lg:border-t-0 lg:px-4 lg:pt-0'>
                        <ListFilter className='w-[1.25rem] shrink-0 font-semibold text-primary' />
                        <div className='flex min-w-0 flex-col gap-1'>
                            <label htmlFor='search_filtro' className='text-caption text-primary'>
                                Disponibilidad
                            </label>
                            <span className='text-label text-text-muted cursor-pointer'>
                                Todos los equipos
                            </span>
                        </div>
                    </div>
                    <div className='sm:col-span-2 lg:col-span-1'>
                        <button className='flex h-[2.875rem] w-full items-center justify-center gap-[0.625rem] rounded-[0.5rem] bg-primary px-[1.125rem] py-[0.8125rem] cursor-pointer lg:w-[10.625rem]'>
                            <ArrowRight className='w-[1.125rem] shrink-0 text-text-inverse' />
                            <span className='whitespace-nowrap text-label text-text-inverse font-semibold'>
                                Explorar equipos
                            </span>
                        </button>
                    </div>
                </div>
            </section>
            {/* Sección de vehiculos */}
            <section className='w-full bg-surface flex flex-col items-center'>
                <div className='w-full max-w-[90rem] bg-surface flex flex-col gap-10 px-4 pb-12 pt-3 sm:px-8 lg:gap-12 lg:px-16 lg:pb-16'>
                    <div className='w-full flex flex-col items-center justify-between gap-6'>
                        <div className='w-full flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
                            <h2 className='text-heading-lg text-text font-semibold'>Cada trabajo, su equipo.</h2>
                            <p className='text-text-muted text-small'>Encuentra lo que tu proyecto necesita</p>
                        </div>
                        <div className='w-full grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                            <div className='flex min-w-0 flex-row items-center gap-3 rounded-xl bg-surface-muted p-4'>
                                <div>
                                    <TractorIcon className='w-[1.5rem] h-[1.5rem] text-primary' />
                                </div>
                                <div>
                                    <p className='text-caption text-primary font-semibold'>
                                        Movimiento de tierra
                                    </p>
                                    <p className='text-label text-text-muted'>
                                        24 equipos
                                    </p>
                                </div>
                            </div>
                            <div className='flex min-w-0 flex-row items-center gap-3 rounded-xl bg-surface-muted p-4'>
                                <div>
                                    <Truck className='w-[1.5rem] h-[1.5rem] text-primary font-semibold' />
                                </div>
                                <div>
                                    <p className='text-caption text-primary'>
                                        Transporte de carga
                                    </p>
                                    <p className='text-label text-text-muted'>
                                        18 equipos
                                    </p>
                                </div>
                            </div>
                            <div className='flex min-w-0 flex-row items-center gap-3 rounded-xl bg-surface-muted p-4'>
                                <div>
                                    <Sprout className='w-[1.5rem] h-[1.5rem] text-primary' />
                                </div>
                                <div>
                                    <p className='text-caption text-primary font-semibold'>
                                        Agrícola
                                    </p>
                                    <p className='text-label text-text-muted'>
                                        12 equipos
                                    </p>
                                </div>
                            </div>
                            <div className='flex min-w-0 flex-row items-center gap-3 rounded-xl bg-surface-muted p-4'>
                                <div>
                                    <Construction className='w-[1.5rem] h-[1.5rem] text-primary font-semibold' />
                                </div>
                                <div>
                                    <p className='text-caption text-primary'>
                                        Elevación y apoyo
                                    </p>
                                    <p className='text-label text-text-muted'>
                                        8 equipos
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-6'>
                        <div className='flex flex-col'>
                            <div>
                                <p className='text-success text-caption font-semibold'>CERCA DE TU PROYECTO</p>
                            </div>
                            <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                                <h2 className='text-text text-title-desktop font-semibold'>Grandes equipos, Gente de aquí.</h2>
                                <div className='flex items-end'>
                                    <button className='flex h-[2.875rem] w-full items-center justify-center gap-2 rounded-lg border border-border bg-primary-foreground px-4 py-3 cursor-pointer sm:w-[9rem]'>
                                        <ArrowUpRight className='text-text w-[1.125rem]' />
                                        <span className='text-text text-label font-semibold'>Ver catálogo</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                            <EquipmentCard></EquipmentCard>
                            <EquipmentCard></EquipmentCard>
                            <EquipmentCard></EquipmentCard>
                        </div>
                    </div>
                </div>
            </section>
            {/* Sección CTA */}
            <section className='w-full h-auto'>
                <div className='mx-auto w-full max-w-[90rem] flex flex-col gap-10 px-4 pb-12 sm:px-8 lg:gap-12 lg:px-16 lg:pb-16'>
                    <div className='w-full grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4'>
                        <div className='flex gap-[1rem]'>
                            <div>
                                <span className='text-success text-label font-semibold'>01</span>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-text text-body font-semibold'>Encuentra tu equipo</p>
                                <p className='text-text-muted text-small'>Explora por categoría y cercanía.</p>
                            </div>
                        </div>
                        <div className='flex gap-[1rem]'>
                            <div>
                                <span className='text-success text-label font-semibold'>02</span>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-text text-body font-semibold'>Habla con el propietario</p>
                                <p className='text-text-muted text-small'>Contacta por WhatsApp o llamada.</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-start gap-[1rem]'>
                            <div>
                                <span className='text-success text-label font-semibold'>03</span>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-text text-body font-semibold'>Comparte tu experiencia</p>
                                <p className='text-text-muted text-small'>Tu valoración fortalece la comunidad.</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className='w-full rounded-3xl bg-primary p-6 sm:p-8 lg:p-11'>
                            <div>
                                <p className='text-text-inverse-muted text-label uppercase'>Para los que mueven el llano</p>
                            </div>
                            <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
                                <div>
                                    <h2 className='text-text-inverse text-title-desktop'>Tus vehiculos tiene mucho por hacer.</h2>
                                    <p className='text-text-inverse-muted text-body'>Publica tus equipos y conecta con nuevos clientes en tu región.</p>
                                </div>
                                <div>
                                    <button className='flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-primary-foreground px-5 py-4 cursor-pointer sm:w-[14.3125rem]'>
                                        <span className='whitespace-nowrap text-label text-text font-semibold'>
                                            Quiero publicar mi equipo
                                        </span>
                                        <ArrowUpRight className='w-[1.125rem] shrink-0 text-text' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
