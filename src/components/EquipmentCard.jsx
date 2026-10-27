import { Heart, MapPin, Star, ArrowUpRight } from 'lucide-react';
import Prueba from '../media/prueba.webp'

export const EquipmentCard = ({
    image,
    category,
    title,
    location,
    rating,
    isAvailable
}) => {
    return (
        <article className='w-full bg-white border border-border rounded-[1rem] overflow-hidden shadow-sm flex flex-col'>

            {/* Contenedor de la imagen y etiqueta de estado */}
            <div className='relative w-full aspect-[2/1]'>
                <img
                    src={image || Prueba}
                    alt={title || 'Equipo Rentia'}
                    className='w-full h-full object-cover'
                />

                {/* Badge de disponibilidad */}
                <span className={`absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-medium ${isAvailable ? 'bg-success-subtle text-success font-semibold' : 'bg-warning-subtle text-warning'
                    }`}>
                    {isAvailable ? '• Disponible' : '• No disponible'}
                </span>

                {/* Botón de favoritos */}
                <button className='absolute top-6 right-6 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text hover:bg-white transition-colors cursor-pointer'>
                    <Heart className='w-4 h-4' />
                </button>
            </div>

            {/* Contenido de la tarjeta */}
            <div className='flex flex-col gap-[0.75rem] p-[1.125rem]'>
                <div>
                    {/* Categoría */}
                    <span className='text-caption text-text-muted font-semibold uppercase tracking-wider'>
                        {category || 'Categoria'}
                    </span>

                    {/* Título principal de la tarjeta (Jerarquía h3) */}
                    <h3 className='text-heading-sm text-text font-semibold'>
                        {title || 'Titulo'}
                    </h3>
                </div>
                {/* Ubicación y Rating */}
                <div className='flex items-center justify-between text-text-muted '>
                    <div className='flex items-center gap-1'>
                        <MapPin className='w-4 h-4 text-text-muted' />
                        <span className='text-small text-text-muted'>{location || 'Tauramena * 64km'}</span>
                    </div>
                    <div className='flex items-center gap-1 font-medium text-text-main'>
                        <Star className='w-4 h-4 fill-text-main text-text-main' />
                        <span>{rating || '5.0'}</span>
                    </div>
                </div>

                {/* Footer de la tarjeta (Acción) */}
                <div className='w-full flex items-center justify-between border-t border-border pt-[0.75rem]'>
                    <a href='#' className='w-full flex flex-row items-center justify-between'>
                        <span className='text-small font-semibold text-primary'>
                            Ver equipo
                        </span>
                        <ArrowUpRight className='w-[1rem] text-primary' />
                    </a>
                </div>
            </div>

        </article>
    );
};