import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Field from '../components/Field';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateClientProfile } from '../services/clientService';

export default function ClientePerfilPage() {
  const { profile, session, refreshProfile } = useAuth();
  const metadata = session?.user?.user_metadata || {};
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || metadata.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || metadata.phone || '');
  const [municipality, setMunicipality] = useState(profile?.municipality || '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [saving, setSaving] = useState(false);
  const email = profile?.email || session?.user?.email || 'Correo no disponible';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaved('');
    if (fullName.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    setSaving(true);
    try {
      await updateClientProfile(session.user.id, { fullName, phone, municipality });
      await refreshProfile();
      setSaved('Perfil actualizado correctamente.');
      setEditing(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setFullName(profile?.full_name || metadata.full_name || '');
    setPhone(profile?.phone || metadata.phone || '');
    setMunicipality(profile?.municipality || '');
    setError('');
    setEditing(false);
  };

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
          <Avatar src={profile?.avatar_url} alt={`Foto de ${fullName}`} className="size-16" />
          <div>
            <h2 className="text-heading-md font-semibold text-text">{fullName}</h2>
            <p className="mt-1 text-small text-text-muted">{profile?.municipality || 'Municipio no registrado'}</p>
          </div>
        </div>
        <ProfilePhotoUpload
          userId={session?.user?.id}
          avatarPath={profile?.avatar_path}
          avatarUrl={profile?.avatar_url}
          name={fullName}
          onUpdated={refreshProfile}
        />
        <Badge tone="success" className="mt-5">Cuenta activa</Badge>
        <dl className="mt-5 space-y-4 border-t border-border pt-5">
          <div>
            <dt className="text-caption text-text-muted">Correo electrónico</dt>
            <dd className="mt-1 text-label text-text">{email}</dd>
          </div>
          <div>
            <dt className="text-caption text-text-muted">Celular</dt>
            <dd className="mt-1 text-label text-text">{phone || 'No registrado'}</dd>
          </div>
        </dl>
        {saved && <p role="status" className="mt-5 text-small text-success">{saved}</p>}
        {!editing ? (
          <Button type="button" variant="secondary" size="lg" className="mt-6" onClick={() => setEditing(true)}>
            Editar mi perfil
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-border pt-5">
            <Field id="perfil-nombre" label="Nombre completo" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            <Field id="perfil-celular" label="Celular" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
            <Field id="perfil-municipio" label="Municipio" value={municipality} onChange={(event) => setMunicipality(event.target.value)} />
            {error && <p role="alert" className="text-small text-danger">{error}</p>}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" size="lg" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
              <Button type="button" variant="secondary" size="lg" onClick={cancelEditing}>Cancelar</Button>
            </div>
          </form>
        )}
      </Card>
    </DashboardLayout>
  );
}
