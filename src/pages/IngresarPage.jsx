import { ArrowRight, ArrowUpRight } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Eyebrow from '../components/Eyebrow';
import Field, { PasswordField } from '../components/Field';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import ImagenNoEncontrada from '../components/ImagenNoEncontrada';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findDemoUser } from '../data/users';

export default function IngresarPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const user = findDemoUser(formData.get('correo'), formData.get('clave'));

    if (!user) {
      setError('Correo o contraseña incorrectos. Usa una cuenta de prueba.');
      return;
    }

    window.localStorage.setItem('rentia.demoUser', user.role);
    navigate(user.home);
  };

  return (
    <AuthLayout enlaceSuperior="Crear una cuenta">
      <Eyebrow>Qué bueno tenerte aquí</Eyebrow>
      <h1 className="mt-3 text-title-mobile font-semibold text-text md:text-title-desktop">Bienvenido de nuevo.</h1>
      <p className="mt-3 text-body-lg text-text-muted">Ingresa para encontrar equipos o gestionar los tuyos.</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <Field id="correo" name="correo" label="Correo electrónico" type="email" defaultValue="maria.lopez@correo.com" />
        <PasswordField id="clave" name="clave" label="Contraseña" defaultValue="cliente123" />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Checkbox id="recordarme">Recordarme</Checkbox>
          <a href="/recuperar-acceso" className="text-label font-semibold text-text">
            Olvidé mi contraseña <span className="lg:hidden">→</span>
          </a>
        </div>

        <Button type="submit" size="lg" fullWidth icon={ArrowRight}>Ingresar</Button>
        {error && <p role="alert" className="text-small text-danger">{error}</p>}
      </form>

      <details className="mt-5 rounded-lg bg-surface-muted p-3 text-small text-text-muted">
        <summary className="cursor-pointer font-semibold text-text">Cuentas de prueba</summary>
        <ul className="mt-2 space-y-1">
          <li>Cliente: maria.lopez@correo.com / cliente123</li>
          <li>Arrendador: carlos.rojas@correo.com / arrendador123</li>
          <li>Administración: andrea.perez@rentia.com / admin123</li>
        </ul>
      </details>

      {/* Escritorio */}
      <p className="mt-6 hidden text-center text-small text-text-muted lg:block">¿Primera vez aquí? Crea tu cuenta →</p>
      <p className="mt-8 hidden text-center text-small text-text-muted lg:block">¿Necesitas una mano? Centro de ayuda</p>

      {/* Móvil */}
      <div className="lg:hidden">
        <Button as="a" href="/crear-cuenta" variant="secondary" size="lg" fullWidth className="mt-4">Crear una cuenta</Button>
        <p className="mt-5 text-small text-text-muted">Tu espacio se adapta a tu rol: cliente, arrendador o administración.</p>
        <ImagenNoEncontrada className="mt-5 aspect-[2/1] w-full rounded-2xl" />
        <p className="mt-5 text-label font-semibold text-text-muted">El trabajo une. El Llano nos mueve.</p>
        <p className="mt-5 inline-flex items-center gap-1 text-small text-text-muted">
          ¿Necesitas una mano? Centro de ayuda <ArrowUpRight size={12} aria-hidden="true" />
        </p>
      </div>
    </AuthLayout>
  );
}
