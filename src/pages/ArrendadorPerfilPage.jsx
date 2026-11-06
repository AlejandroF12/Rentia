import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import { useAuth } from '../context/AuthContext';

export default function ArrendadorPerfilPage() {
  const { profile, session } = useAuth();
  const metadata = session?.user?.user_metadata || {};
  const fullName = profile?.full_name || metadata.full_name || 'Nombre no disponible';
  const email = profile?.email || session?.user?.email || 'Correo no disponible';

  return (
    <DashboardLayout rol="arrendador" activo="perfil">
      <PageHeader
        volver={{ to: '/arrendador/equipos', texto: 'Volver a mis equipos' }}
        eyebrow="Mi negocio / Mi perfil"
        titulo="Tu información de arrendador."
        subtitulo="Estos son los datos asociados a tu cuenta de Rentia."
      />
      <Card className="mt-6 max-w-2xl lg:mt-8">
        <div className="flex items-center gap-4">
          <Avatar className="size-16" />
          <div>
            <h2 className="text-heading-md font-semibold text-text">{fullName}</h2>
            <p className="mt-1 text-small text-text-muted">{profile?.municipality || 'Municipio no registrado'}</p>
          </div>
        </div>
        <Badge tone="success" className="mt-5">Cuenta activa</Badge>
        <dl className="mt-5 space-y-4 border-t border-border pt-5">
          <div><dt className="text-caption text-text-muted">Correo electrónico</dt><dd className="mt-1 text-label text-text">{email}</dd></div>
          <div><dt className="text-caption text-text-muted">Miembro desde</dt><dd className="mt-1 text-label text-text">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }) : 'No disponible'}</dd></div>
        </dl>
      </Card>
    </DashboardLayout>
  );
}
