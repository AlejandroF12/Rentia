import Navbar from '../components/Navbar';
import MenuPanel from '../components/MenuPanel';
import Eyebrow from '../components/Eyebrow';
import EquipoCard from '../components/EquipoCard';
import { equipos } from '../data/muestra';

/** Contenido de fondo de cada pantalla con el menú abierto. */
const fondos = {
  public: { eyebrow: 'Casanare, Colombia', titulo: 'Tu próximo aliado.', tarjetas: [equipos[0], equipos[2]] },
  cliente: { eyebrow: 'Mi cuenta / Cliente', titulo: 'Hola, María.', tarjetas: [equipos[0], equipos[2]] },
  arrendador: { eyebrow: 'Mi negocio / Arrendador', titulo: 'Tu equipo mueve el Llano.', tarjetas: [equipos[0], equipos[2]] },
  admin: {
    eyebrow: 'Administración / Moderación',
    titulo: 'Una comunidad de confianza.',
    subtitulo: 'Gestiona los perfiles y su estado.',
    metricas: [['248', 'Usuarios activos'], ['6', 'Suspendidos']],
    tarjetas: [equipos[2]],
  },
};

/**
 * Pantalla con el menú abierto.
 * variant: "public" | "cliente" | "arrendador" | "admin"
 */
export default function MenuPage({ variant = 'public' }) {
  const f = fondos[variant];

  return (
    <div className="relative min-h-screen bg-background font-sans text-text">
      <Navbar variant={variant} menuOpen />

      <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 md:px-8 lg:px-16">
        <Eyebrow>{f.eyebrow}</Eyebrow>
        <h1 className="mt-3 text-title-mobile font-semibold text-text md:text-title-desktop">{f.titulo}</h1>
        <p className="mt-4 text-body-lg text-text-muted">{f.subtitulo ?? 'Maquinaria y vehículos de Casanare.'}</p>

        {f.metricas && (
          <div className="mt-8 grid grid-cols-2 gap-5 lg:max-w-[760px]">
            {f.metricas.map(([valor, etiqueta]) => (
              <div key={etiqueta} className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-title-desktop font-semibold text-text">{valor}</p>
                <p className="mt-2 text-label text-text-muted">{etiqueta}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:max-w-[760px]">
          {f.tarjetas.map((e) => (
            <EquipoCard key={e.id} equipo={e} favorito={false} />
          ))}
        </div>
      </main>

      {/* Velo + panel */}
      <div className="absolute inset-x-0 bottom-0 top-16 z-20 bg-overlay/40 md:top-[72px]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-16 z-30 md:inset-x-auto md:right-8 md:top-[88px] lg:right-16">
        <MenuPanel variant={variant} />
      </div>
    </div>
  );
}
