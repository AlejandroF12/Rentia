import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';
import Eyebrow from '../components/Eyebrow';

export default function CrearCuentaPage() {
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
        Los documentos legales están disponibles como borradores informativos. La aceptación de términos y la autorización de datos se incorporarán al formulario antes de reabrir el registro.
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-small">
        <Link to="/terminos" className="min-h-11 inline-flex items-center text-primary underline underline-offset-2">Términos y condiciones</Link>
        <Link to="/privacidad" className="min-h-11 inline-flex items-center text-primary underline underline-offset-2">Política de privacidad</Link>
      </div>

      <div className="mt-8 space-y-3">
        <Button as={Link} to="/ingresar" size="lg" fullWidth icon={ArrowRight}>
          Iniciar sesión
        </Button>
        <Button as={Link} to="/catalogo" variant="secondary" size="lg" fullWidth icon={Search}>
          Explorar equipos
        </Button>
      </div>
    </AuthLayout>
  );
}
