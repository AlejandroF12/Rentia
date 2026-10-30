import { ArrowRight, User, Tractor } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import Eyebrow from '../components/Eyebrow';
import Field, { PasswordField } from '../components/Field';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';

function OpcionRol({ valor, icono: Icono, titulo, descripcion, marcado = false }) {
  return (
    <label className="relative flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-4 has-checked:border-2 has-checked:border-primary has-checked:bg-surface-muted lg:flex-col lg:gap-4">
      <input type="radio" name="rol" value={valor} defaultChecked={marcado} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 rounded-full border border-border bg-surface peer-checked:border-[5px] peer-checked:border-primary lg:absolute lg:right-4 lg:top-4 lg:mt-0"
      />
      <Icono size={20} aria-hidden="true" className="hidden text-text lg:block" />
      <span>
        <span className="block text-label font-semibold text-text">{titulo}</span>
        <span className="mt-1 block text-small text-text-muted">{descripcion}</span>
      </span>
    </label>
  );
}

export default function CrearCuentaPage() {
  return (
    <AuthLayout enlaceSuperior="Ya tengo cuenta">
      <Eyebrow>Sé parte de la comunidad</Eyebrow>
      <h1 className="mt-3 text-title-mobile font-semibold text-text md:text-title-desktop">Hagamos equipo.</h1>
      <p className="mt-3 text-body-lg text-text-muted">Crea tu cuenta y elige cómo quieres participar.</p>

      <form className="mt-6 space-y-5">
        <fieldset>
          <legend className="mb-3 text-label font-semibold text-text">¿Cómo quieres usar Rentia?</legend>
          <div className="grid gap-3 lg:grid-cols-2">
            <OpcionRol valor="cliente" icono={User} titulo="Soy cliente" descripcion="Busco equipos" />
            <OpcionRol valor="arrendador" icono={Tractor} titulo="Soy arrendador" descripcion="Publico mis equipos" marcado />
          </div>
        </fieldset>

        <Field id="nombre" label="Nombre completo" defaultValue="Carlos Rojas" />
        <Field id="correo" label="Correo electrónico" type="email" defaultValue="carlos.rojas@correo.com" />
        <Field id="celular" label="Celular" type="tel" defaultValue="+57 310 456 7820" />
        <PasswordField id="clave" label="Contraseña" defaultValue="••••••••••••" hint="Usa al menos 8 caracteres." />

        <div className="space-y-3">
          <Checkbox id="terminos" defaultChecked className="text-small">
            Acepto los Términos de uso y la Política de privacidad de Rentia.
          </Checkbox>
          <Checkbox id="mostrar-celular" className="text-small">
            Autorizo mostrar mi celular en mis publicaciones para recibir WhatsApp y llamadas directas.
          </Checkbox>
          <p className="text-small text-text-muted">Tu correo no será público. Puedes revisar tus autorizaciones en Mi perfil.</p>
        </div>

        <Button type="submit" size="lg" fullWidth icon={ArrowRight}>Crear mi cuenta de arrendador</Button>
      </form>

      <Button as="a" href="/ingresar" variant="secondary" size="lg" fullWidth className="mt-4 lg:hidden">Ya tengo cuenta · Ingresar</Button>
      <a href="/catalogo" className="mt-6 block text-center text-small text-text-muted">¿Solo quieres explorar? Ir al catálogo →</a>
      <p className="mt-6 hidden text-center text-small text-text-muted lg:block">¿Necesitas una mano? Centro de ayuda</p>
    </AuthLayout>
  );
}
