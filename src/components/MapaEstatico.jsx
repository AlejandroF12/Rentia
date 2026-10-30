import { Info, MapPin } from 'lucide-react';

/** Ilustración estática del mapa (colores map-*). municipio y sector son los rótulos. */
export default function MapaEstatico({ municipio = 'Yopal', sector = 'El Morro', className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-map-background ${className}`}>
      <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
        <rect width="600" height="200" className="fill-map-background" />
        <polygon points="0,0 300,0 330,200 0,200" className="fill-map-land" />
        <path d="M-10 60 C 80 10, 160 120, 260 80 S 420 30, 610 150" fill="none" strokeWidth="14" strokeLinecap="round" className="stroke-map-water" />
        <circle cx="300" cy="100" r="42" className="fill-primary-alpha-14 stroke-primary-alpha-40" strokeWidth="1" />
      </svg>
      <span className="absolute left-5 top-4 text-label font-semibold text-text">{municipio}</span>
      <span className="absolute left-[56%] top-[68%] text-caption text-text-muted">{sector}</span>
      <span className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <MapPin size={16} aria-hidden="true" />
      </span>
      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-1.5 text-caption text-text">
        <Info size={12} aria-hidden="true" />
        Ubicación aproximada · Mapa estático
      </span>
    </div>
  );
}
