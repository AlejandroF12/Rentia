import { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Eyebrow from '../components/Eyebrow';
import Field, { PasswordField } from '../components/Field';
import OpcionSeleccionable from '../components/OpcionSeleccionable';
import { loadProfile, signUp } from '../services/authService';

const PUBLIC_REGISTRATION_ENABLED = true;

function RegistroPausado() {
  return (
    <AuthLayout enlaceSuperior="Ya tengo cuenta">
      <Eyebrow>Registro temporalmente pausado</Eyebrow>
      <h1 className="mt-3 text-title-mobile font-semibold text-text md:text-title-desktop">
        Estamos preparando Rentia.
      </h1>
      <p className="mt-3 text-body-lg text-text-muted">
        Por ahora no aceptamos cuentas nuevas. Si ya tienes una cuenta, puedes iniciar sesión; mientras tanto, el catálogo sigue disponible para explorar.
      </p>
      <p className="mt-3 text-small leading-relaxed text-text-muted">
        Los documentos legales están disponibles como información del proyecto. Si se vuelve a limitar el registro, esta pantalla se mostrará nuevamente.
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-small">
        <Link to="/terminos" className="min-h-11 inline-flex items-center text-primary underline underline-offset-2">Términos y condiciones</Link>
        <Link to="/privacidad" className="min-h-11 inline-flex items-center text-primary underline underline-offset-2">Política de privacidad</Link>
      </div>
      <div className="mt-8 space-y-3">
        <Button as={Link} to="/ingresar" size="lg" fullWidth icon={ArrowRight}>Iniciar sesión</Button>
        <Button as={Link} to="/catalogo" variant="secondary" size="lg" fullWidth icon={Search}>Explorar equipos</Button>
      </div>
    </AuthLayout>
  );
}

function FormularioRegistro() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    if (password !== formData.get('confirmPassword')) {
      setError('Las contraseñas no coinciden.');
      setSubmitting(false);
      return;
    }

    try {
      const { user, session } = await signUp({
        email: String(formData.get('email') || '').trim(),
        password,
        fullName: String(formData.get('fullName') || '').trim(),
        phone: String(formData.get('phone') || '').trim(),
        role,
        contactAuthorized: formData.get('contactAuthorized') === 'on',
      });

      if (session && user) {
        const profile = await loadProfile(user.id);
        const destinations = { cliente: '/cliente', arrendador: '/arrendador/equipos' };
        navigate(profile.status === 'suspendido' ? '/cuenta-suspendida' : destinations[profile.role] || '/');
        return;
      }

      setNotice('Solicitud de registro enviada. Si la confirmación por correo está activa en Supabase, revisa tu bandeja de entrada y confirma la cuenta antes de iniciar sesión.');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout enlaceSuperior="Ya tengo cuenta">
      <Eyebrow>Únete a Rentia</Eyebrow>
      <h1 className="mt-3 text-title-mobile font-semibold text-text md:text-title-desktop">Crea tu cuenta.</h1>
      <p className="mt-3 text-body-lg text-text-muted">Explora equipos o publica los tuyos en Casanare.</p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <fieldset className="space-y-3">
          <legend className="mb-3 text-label font-medium text-text">Quiero usar Rentia como</legend>
          <OpcionSeleccionable
            id="role-cliente"
            name="role"
            value="cliente"
            titulo="Cliente"
            descripcion="Buscar equipos para mi proyecto"
            checked={role === 'cliente'}
            onChange={(event) => setRole(event.target.value)}
            required
          />
          <OpcionSeleccionable
            id="role-arrendador"
            name="role"
            value="arrendador"
            titulo="Arrendador"
            descripcion="Publicar equipos para alquilar"
            checked={role === 'arrendador'}
            onChange={(event) => setRole(event.target.value)}
          />
        </fieldset>
        <Field id="fullName" name="fullName" label="Nombre completo" autoComplete="name" minLength={2} maxLength={120} required />
        <Field id="email" name="email" label="Correo electrónico" type="email" autoComplete="email" maxLength={254} required />
        <Field
          id="phone"
          name="phone"
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          required={role === 'arrendador'}
          hint={role === 'arrendador' ? 'Necesario para recibir consultas sobre tus equipos.' : 'Opcional para clientes.'}
        />
        <PasswordField
          id="password"
          name="password"
          label="Contraseña"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          hint="Usa al menos 8 caracteres."
        />
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar contraseña"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
        />

        {role === 'arrendador' && (
          <Checkbox id="contactAuthorized" name="contactAuthorized">
            Autorizo que mi nombre y teléfono se muestren a usuarios con sesión para consultar mis equipos. Es opcional y puedo cambiarlo después.
          </Checkbox>
        )}

        <div className="space-y-3">
          <Checkbox id="ageConfirmed" name="ageConfirmed" required>
            Confirmo que tengo 18 años o más.
          </Checkbox>
          <Checkbox id="acceptTerms" name="acceptTerms" required>
            He leído y acepto los términos de uso y la política de privacidad del proyecto.
          </Checkbox>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pl-6 text-small">
            <Link to="/terminos" className="min-h-11 inline-flex items-center text-primary underline underline-offset-2">Términos de uso</Link>
            <Link to="/privacidad" className="min-h-11 inline-flex items-center text-primary underline underline-offset-2">Privacidad</Link>
          </div>
        </div>

        {error && <p role="alert" className="text-small text-danger">{error}</p>}
        {notice && <p role="status" aria-live="polite" className="text-small text-success">{notice}</p>}

        <Button type="submit" size="lg" fullWidth icon={ArrowRight} disabled={submitting || !role}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="mt-6 text-center text-small text-text-muted">
        ¿Ya tienes cuenta? <Link to="/ingresar" className="font-semibold text-primary">Inicia sesión</Link>
      </p>
    </AuthLayout>
  );
}

export default function CrearCuentaPage() {
  return PUBLIC_REGISTRATION_ENABLED ? <FormularioRegistro /> : <RegistroPausado />;
}
