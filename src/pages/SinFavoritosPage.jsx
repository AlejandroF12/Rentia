import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import EquipoCard from '../components/EquipoCard';
import { clienteMuestra } from '../data/panel';
import { useAuth } from '../context/AuthContext';
import { loadClientFavorites } from '../services/clientService';
import { useEffect, useState } from 'react';

/** Favoritos sin elementos (estado vacío). */
export default function SinFavoritosPage() {
  const { session } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    loadClientFavorites(session.user.id)
      .then(setFavorites)
      .catch((loadError) => setError(loadError.message));
  }, [session?.user?.id]);

  const equiposFavoritos = favorites
    .filter(({ equipment }) => equipment)
    .map(({ equipment }) => ({
      ...equipment,
      lugar: equipment.municipality,
      distancia: '',
      puntaje: '—',
      disponible: equipment.is_available && equipment.publication_status === 'publicada',
    }));

  return (
    <DashboardLayout rol="cliente" activo="favoritos">
      <PageHeader
        volver={{ to: '/cliente', texto: 'Volver a mi espacio' }}
        eyebrow="Mi cuenta / Favoritos"
        titulo="Tus próximos aliados."
        subtitulo="Guarda los equipos que te interesan y encuéntralos aquí."
      />

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <h2 className="text-label font-semibold text-text-muted lg:text-label">Favoritos ({equiposFavoritos.length})</h2>
          {error && <p role="alert" className="mt-4 text-small text-danger">{error}</p>}
          {equiposFavoritos.length > 0 ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {equiposFavoritos.map((equipo) => <EquipoCard key={equipo.id} equipo={equipo} favorito={false} />)}
            </div>
          ) : (
          <Card className="mt-4 flex flex-col items-center px-5 py-10 text-center md:py-16">
            <Heart size={36} aria-hidden="true" className="text-text" strokeWidth={1.5} />
            <h3 className="mt-6 text-heading-lg font-semibold text-text md:mt-8">Aún no tienes favoritos.</h3>
            <p className="mt-4 max-w-md text-body-lg text-text-muted">
              En el catálogo, toca el corazón de un equipo para guardarlo en tu espacio.
            </p>
            <Button as={Link} to="/catalogo" size="lg" icon={ArrowRight} className="mt-6 w-full md:w-auto">
              Explorar equipos
            </Button>
          </Card>
          )}

          <InfoBox title="Solo para ti" className="mt-6 lg:hidden">
            Guardar un equipo no lo reserva ni confirma su disponibilidad. Consulta siempre con el propietario.
          </InfoBox>

          <Button as={Link} to="/cliente" variant="secondary" size="lg" className="mt-6 w-full md:w-auto">
            Volver a mi espacio
          </Button>
        </div>

        <aside className="hidden space-y-4 lg:block">
          <Card className="flex items-center gap-4 p-5">
            <Avatar className="size-12" />
            <div>
              <p className="text-heading-sm font-semibold text-text">{clienteMuestra.nombre}</p>
              <p className="mt-1 text-small text-text-muted">{clienteMuestra.detalle}</p>
            </div>
          </Card>
          <InfoBox title="Solo para ti">
            Guardar un equipo no lo reserva ni confirma su disponibilidad. Consulta siempre con el propietario.
          </InfoBox>
        </aside>
      </div>
    </DashboardLayout>
  );
}
