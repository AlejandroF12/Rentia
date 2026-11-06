import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import InfoBox from '../components/InfoBox';
import { useAuth } from '../context/AuthContext';
import { loadOwnerEquipment } from '../services/equipmentService';
import { loadClientReviewSummary } from '../services/clientService';
import { Plus } from 'lucide-react';

export default function ResumenArrendadorPage() {
  const { session, profile } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    Promise.all([
      loadOwnerEquipment(session.user.id),
      loadClientReviewSummary(session.user.id),
    ])
      .then(([ownerEquipment, summary]) => {
        setEquipment(ownerEquipment);
        setReviewSummary(summary);
      })
      .catch((loadError) => setError(loadError.message));
  }, [session?.user?.id]);

  const published = equipment.filter((item) => item.publication_status === 'publicada');
  const available = published.filter((item) => item.is_available);
  const average = reviewSummary?.received.length
    ? reviewSummary.received.reduce((total, review) => total + review.rating, 0) / reviewSummary.received.length
    : null;

  return (
    <DashboardLayout rol="arrendador" activo="resumen">
      <PageHeader
        eyebrow="Mi negocio / Resumen"
        titulo={`Hola, ${profile?.full_name?.split(' ')[0] || 'arrendador'}.`}
        subtitulo="Consulta el estado real de tus publicaciones y tu reputación en Rentia."
        accion={<Button as={Link} to="/arrendador/equipos/nuevo" size="lg" icon={Plus}>Agregar vehículo</Button>}
      />
      {error && <p role="alert" className="mt-6 text-small text-danger">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-5">
        {[
          [equipment.length, 'Equipos'],
          [published.length, 'Publicados'],
          [available.length, 'Disponibles'],
          [average === null ? '—' : average.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }), 'Valoración'],
        ].map(([value, label]) => (
          <Card key={label}>
            <p className="text-title-mobile font-semibold text-primary">{value}</p>
            <p className="mt-1 text-small text-text-muted">{label}</p>
          </Card>
        ))}
      </div>

      {equipment.length === 0 && !error ? (
        <InfoBox title="Aún no tienes equipos publicados" className="mt-6 lg:mt-8">
          Agrega tu primer equipo para comenzar a recibir consultas de clientes.
        </InfoBox>
      ) : (
        <Card className="mt-6 lg:mt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-heading-md font-semibold text-text">Actividad de tus equipos</h2>
            <Link to="/arrendador/equipos" className="text-small font-semibold text-text">Ver todos</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {equipment.slice(0, 5).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-label font-semibold text-text">{item.name}</p>
                  <p className="mt-1 text-small text-text-muted">{item.municipality}</p>
                </div>
                <span className="text-small text-text-muted">{item.publication_status === 'publicada' ? (item.is_available ? 'Disponible' : 'No disponible') : 'Borrador'}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </DashboardLayout>
  );
}
