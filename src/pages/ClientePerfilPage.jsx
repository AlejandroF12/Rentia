import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import { useAuth } from '../context/AuthContext';

export default function ClientePerfilPage() {
  const { profile, session } = useAuth();
  const metadata = session?.user?.user_metadata || {};
  const fullName = profile?.full_name || metadata.full_name || 'Nombre no disponible';
  const email = profile?.email || session?.user?.email || 'Correo no disponible';
  const phone = profile?.phone || metadata.phone || 'No registrado';

  return (
    <DashboardLayout rol="cliente" activo="perfil">
      <PageHeader
        volver={{ to: '/cliente', texto: 'Volver a mi espacio' }}
        eyebrow="Mi cuenta / Mi perfil"
        titulo="Tu información."
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
          <div>
            <dt className="text-caption text-text-muted">Correo electrónico</dt>
            <dd className="mt-1 text-label text-text">{email}</dd>
          </div>
          <div>
            <dt className="text-caption text-text-muted">Celular</dt>
            <dd className="mt-1 text-label text-text">{phone}</dd>
          </div>
        </dl>
      </Card>
    </DashboardLayout>
  );
}
