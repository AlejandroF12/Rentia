import { ArrowUpRight, Disc, Search, MapPin, ListFilter, ArrowRight, TractorIcon, Truck, Sprout, Construction } from 'lucide-react'
import heroImage from '../media/heroImage.webp'
import EquipoCard from '../components/EquipoCard'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadFeaturedEquipment } from '../services/equipmentService'
import { loadFavoriteEquipmentIds } from '../services/clientService'
import { useAuth } from '../context/AuthContext'

export const Home = () => {
    const [featuredEquipment, setFeaturedEquipment] = useState([])
    const [featuredError, setFeaturedError] = useState('')
    const [featuredLoaded, setFeaturedLoaded] = useState(false)
    const [favoriteData, setFavoriteData] = useState({ userId: null, ids: [], error: '', loaded: false })
    const [searchTerm, setSearchTerm] = useState('')
    const [locationTerm, setLocationTerm] = useState('')
    const [availableOnly, setAvailableOnly] = useState(false)
    const navigate = useNavigate()
    const { session, profile } = useAuth()
    const favoriteUserId = profile?.role === 'cliente' ? session?.user?.id : null
    const userFavoriteData = favoriteData.userId === favoriteUserId ? favoriteData : null

    const handleSearch = (event) => {
        event.preventDefault()
        const params = new URLSearchParams()
        if (searchTerm.trim()) params.set('search', searchTerm.trim())
        if (locationTerm.trim()) params.set('municipality', locationTerm.trim())
        if (availableOnly) params.set('available', 'true')
        navigate(`/catalogo${params.toString() ? `?${params.toString()}` : ''}`)
    }

    useEffect(() => {
        loadFeaturedEquipment()
            .then((items) => setFeaturedEquipment(items.filter((item) => item.rating > 0)))
            .catch((error) => setFeaturedError(error.message))
            .finally(() => setFeaturedLoaded(true))
    }, [])

    useEffect(() => {
        const userId = favoriteUserId
        let active = true
        if (!userId) return () => { active = false }

        loadFavoriteEquipmentIds(userId)
            .then((ids) => {
                if (!active) return
                setFavoriteData({ userId, ids, error: '', loaded: true })
            })
            .catch((error) => {
                if (!active) return
                setFavoriteData({ userId, ids: [], error: error.message, loaded: false })
            })

        return () => { active = false }
    }, [favoriteUserId])

    return (
        <div id='inicio' className='w-full'>
            {/* Hero section */}
            <section className='w-full bg-surface flex flex-col gap-8 items-center px-4 py-8 sm:px-8 sm:py-10 lg:px-16 lg:py-11'>
                {/* Sección 1 */}
                <div className='w-full max-w-[90rem] grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-20'>
                    { /* Contenido del Hero */}
                    <div className='motion-enter flex w-full max-w-[35rem] flex-col gap-6'>
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
                    <div className='motion-enter motion-delay-2 w-full'>
                        <img src={heroImage} className='w-full aspect-[4/3] max-h-[27.5rem] object-cover rounded-2xl sm:rounded-3xl' alt='Retroexcavadora en Hero section' />
                    </div>
                </div>
                { /* Sección 2: Buscador */}
                <form onSubmit={handleSearch} className='motion-enter motion-delay-3 w-full max-w-[90rem] grid grid-cols-1 gap-4 rounded-lg border border-border p-4 shadow-[0px_0.75rem_2.5rem_0px_rgba(21,63,76,0.07)] sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center'>
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
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className='min-h-11 w-full min-w-0 text-label text-text-muted focus:outline-none' />
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
                                placeholder='Municipio o ciudad'
                                value={locationTerm}
                                onChange={(event) => setLocationTerm(event.target.value)}
                                className='min-h-11 w-full min-w-0 text-label text-text-muted focus:outline-none' />
                        </div>
                    </div>
                    <div className='flex min-w-0 flex-row items-center gap-3 border-border sm:border-t sm:pt-4 lg:border-l lg:border-t-0 lg:px-4 lg:pt-0'>
                        <ListFilter className='w-[1.25rem] shrink-0 font-semibold text-primary' />
                        <div className='flex min-w-0 flex-col gap-1'>
                            <label htmlFor='search_filtro' className='text-caption text-primary'>
                                Disponibilidad
                            </label>
                            <select value={availableOnly ? 'available' : 'all'} onChange={(event) => setAvailableOnly(event.target.value === 'available')} className='min-h-11 bg-transparent text-label text-text-muted focus:outline-none'>
                                <option value='all'>Todos los equipos</option>
                                <option value='available'>Solo disponibles</option>
                            </select>
                        </div>
                    </div>
                    <div className='sm:col-span-2 lg:col-span-1'>
                        <button type='submit' className='action-explore flex h-[2.875rem] w-full items-center justify-center gap-[0.625rem] rounded-[0.5rem] bg-primary px-[1.125rem] py-[0.8125rem] cursor-pointer lg:w-[10.625rem]'>
                            <ArrowRight className='w-[1.125rem] shrink-0 text-text-inverse' />
                            <span className='whitespace-nowrap text-label text-text-inverse font-semibold'>
                                Explorar equipos
                            </span>
                        </button>
                    </div>
                </form>
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
                            <Link to={`/catalogo?category=${encodeURIComponent('Movimiento de tierra')}`} className='motion-enter motion-delay-1 group flex min-w-0 items-center gap-3 rounded-xl bg-surface-muted p-4 transition-colors hover:bg-surface-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>
                                <div>
                                    <TractorIcon className='w-[1.5rem] h-[1.5rem] text-primary' />
                                </div>
                                <div>
                                    <p className='text-caption font-semibold text-primary'>
                                        Movimiento de tierra
                                    </p>
                                    <p className='text-label text-text-muted group-hover:text-text'>
                                        Ver equipos de esta categoría
                                    </p>
                                </div>
                            </Link>
                            <Link to={`/catalogo?category=${encodeURIComponent('Transporte de carga')}`} className='motion-enter motion-delay-2 group flex min-w-0 items-center gap-3 rounded-xl bg-surface-muted p-4 transition-colors hover:bg-surface-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>
                                <div>
                                    <Truck className='w-[1.5rem] h-[1.5rem] text-primary font-semibold' />
                                </div>
                                <div>
                                    <p className='text-caption font-semibold text-primary'>
                                        Transporte de carga
                                    </p>
                                    <p className='text-label text-text-muted group-hover:text-text'>
                                        Ver equipos de esta categoría
                                    </p>
                                </div>
                            </Link>
                            <Link to={`/catalogo?category=${encodeURIComponent('Agrícola')}`} className='motion-enter motion-delay-3 group flex min-w-0 items-center gap-3 rounded-xl bg-surface-muted p-4 transition-colors hover:bg-surface-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>
                                <div>
                                    <Sprout className='w-[1.5rem] h-[1.5rem] text-primary' />
                                </div>
                                <div>
                                    <p className='text-caption text-primary font-semibold'>
                                        Agrícola
                                    </p>
                                    <p className='text-label text-text-muted group-hover:text-text'>
                                        Ver equipos de esta categoría
                                    </p>
                                </div>
                            </Link>
                            <Link to={`/catalogo?category=${encodeURIComponent('Elevación y apoyo')}`} className='motion-enter motion-delay-4 group flex min-w-0 items-center gap-3 rounded-xl bg-surface-muted p-4 transition-colors hover:bg-surface-selected focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>
                                <div>
                                    <Construction className='w-[1.5rem] h-[1.5rem] text-primary font-semibold' />
                                </div>
                                <div>
                                    <p className='text-caption font-semibold text-primary'>
                                        Elevación y apoyo
                                    </p>
                                    <p className='text-label text-text-muted group-hover:text-text'>
                                        Ver equipos de esta categoría
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div id='catalogo' className='w-full flex flex-col gap-6'>
                        <div className='flex flex-col'>
                            <div>
                                <p className='text-success text-caption font-semibold'>CERCA DE TU PROYECTO</p>
                            </div>
                            <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                                <h2 className='text-text text-title-mobile font-semibold md:text-title-desktop'>Grandes equipos, gente de aquí.</h2>
                                <div className='flex items-end'>
                                    <Link to='/catalogo' className='flex h-[2.875rem] w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 cursor-pointer transition-transform hover:-translate-y-0.5 sm:w-[9rem]'>
                                        <ArrowUpRight className='text-text w-[1.125rem]' />
                                        <span className='text-text text-label font-semibold'>Ver catálogo</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {featuredError && <p role='alert' className='text-small text-danger'>{featuredError}</p>}
                        {userFavoriteData?.error && <p role='alert' className='text-small text-danger'>{userFavoriteData.error}</p>}
                        {!featuredError && !featuredLoaded && (
                            <p role='status' className='text-body text-text-muted'>Cargando equipos destacados…</p>
                        )}
                        {!featuredError && featuredLoaded && featuredEquipment.length === 0 && (
                            <p className='text-body text-text-muted'>Aún no hay equipos disponibles con valoraciones publicadas.</p>
                        )}
                        {featuredEquipment.length > 0 && (
                            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                                {featuredEquipment.map((item) => (
                                    <EquipoCard
                                        key={item.id}
                                        equipo={{
                                            id: item.id,
                                            categoria: item.category,
                                            nombre: item.name,
                                            lugar: item.municipality,
                                            distancia: 'ubicación aproximada',
                                            puntaje: item.rating.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
                                            disponible: item.is_available,
                                            imagen: item.image,
                                        }}
                                        favorito={profile?.role === 'cliente' && userFavoriteData?.loaded}
                                        isFavorite={userFavoriteData?.ids.includes(item.id) ?? false}
                                        onFavoriteChange={(id, value) => setFavoriteData((current) => current.userId !== favoriteUserId ? current : ({
                                            ...current,
                                            ids: value ? [...new Set([...current.ids, id])] : current.ids.filter((itemId) => itemId !== id),
                                        }))}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {/* Sección CTA */}
            <section className='w-full bg-background'>
                <div className='mx-auto flex w-full max-w-[90rem] flex-col gap-10 px-4 py-12 sm:px-8 lg:gap-12 lg:px-16 lg:py-16'>
                    <section id='como-funciona' aria-labelledby='como-funciona-title' className='scroll-mt-24'>
                        <div className='mb-6 max-w-2xl'>
                            <p className='text-caption font-semibold uppercase tracking-wide text-success'>Claro y directo</p>
                            <h2 id='como-funciona-title' className='mt-2 text-title-mobile font-semibold text-text md:text-title-desktop'>¿Cómo funciona Rentia?</h2>
                            <p className='mt-3 text-body-lg text-text-muted'>Conectamos a quienes necesitan un equipo con las personas que lo ofrecen. La búsqueda es aquí; los detalles del alquiler se acuerdan directamente entre ustedes.</p>
                        </div>
                        <div className='grid gap-5 lg:grid-cols-2'>
                            <div className='surface-card rounded-2xl border border-border bg-surface p-5 sm:p-6'>
                                <h3 className='text-heading-md font-semibold text-text'>Si buscas un equipo</h3>
                                <ol className='mt-5 space-y-5'>
                                    <li className='flex gap-4'>
                                        <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-small font-semibold text-primary-foreground'>1</span>
                                        <div><p className='font-semibold text-text'>Busca y compara</p><p className='mt-1 text-small leading-relaxed text-text-muted'>Filtra por tipo, municipio y disponibilidad; revisa fotos, ubicación aproximada y detalles de cada publicación.</p></div>
                                    </li>
                                    <li className='flex gap-4'>
                                        <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-small font-semibold text-primary-foreground'>2</span>
                                        <div><p className='font-semibold text-text'>Contacta al arrendador</p><p className='mt-1 text-small leading-relaxed text-text-muted'>Inicia sesión para ver las opciones de contacto que el arrendador haya autorizado y pregúntale por el equipo.</p></div>
                                    </li>
                                    <li className='flex gap-4'>
                                        <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-small font-semibold text-primary-foreground'>3</span>
                                        <div><p className='font-semibold text-text'>Acuerden el alquiler</p><p className='mt-1 text-small leading-relaxed text-text-muted'>Confirmen directamente precio, fechas, entrega y condiciones. Después de tu experiencia, puedes dejar una valoración.</p></div>
                                    </li>
                                </ol>
                                <Link to='/catalogo' className='mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-label font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>Explorar equipos <ArrowRight size={16} aria-hidden='true' /></Link>
                            </div>
                            <div className='surface-card rounded-2xl border border-border bg-surface p-5 sm:p-6'>
                                <h3 className='text-heading-md font-semibold text-text'>Si ofreces un equipo</h3>
                                <ol className='mt-5 space-y-5'>
                                    <li className='flex gap-4'>
                                        <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-success-subtle text-small font-semibold text-success'>1</span>
                                        <div><p className='font-semibold text-text'>Crea tu cuenta de arrendador</p><p className='mt-1 text-small leading-relaxed text-text-muted'>Completa tu perfil y configura si autorizas que usuarios con sesión vean tu teléfono.</p></div>
                                    </li>
                                    <li className='flex gap-4'>
                                        <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-success-subtle text-small font-semibold text-success'>2</span>
                                        <div><p className='font-semibold text-text'>Publica y mantén al día tu equipo</p><p className='mt-1 text-small leading-relaxed text-text-muted'>Añade fotos, descripción y municipio; actualiza la disponibilidad cuando cambie.</p></div>
                                    </li>
                                    <li className='flex gap-4'>
                                        <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-success-subtle text-small font-semibold text-success'>3</span>
                                        <div><p className='font-semibold text-text'>Conversa y coordina directamente</p><p className='mt-1 text-small leading-relaxed text-text-muted'>Responde a las personas interesadas y acuerda con ellas el precio, las fechas y las condiciones.</p></div>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </section>
                    <div className='w-full'>
                        <div className='w-full rounded-3xl bg-primary p-6 sm:p-8 lg:p-11'>
                            <div>
                                <p className='text-text-inverse-muted text-label uppercase'>Para arrendadores de la región</p>
                            </div>
                            <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
                                <div>
                                    <h2 className='text-text-inverse text-title-mobile md:text-title-desktop'>¿Tienes un equipo para alquilar?</h2>
                                    <p className='text-text-inverse-muted text-body'>Publícalo en Rentia y conecta con personas que buscan equipos en Casanare.</p>
                                </div>
                                <div>
                                    <Link to='/crear-cuenta' className='flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-surface px-5 py-4 cursor-pointer transition-transform hover:-translate-y-0.5 sm:w-[14.3125rem]'>
                                        <span className='whitespace-nowrap text-label text-text font-semibold'>
                                            Crear cuenta de arrendador
                                        </span>
                                        <ArrowUpRight className='w-[1.125rem] shrink-0 text-text' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
