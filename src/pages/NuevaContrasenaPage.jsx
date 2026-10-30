import { Check } from 'lucide-react';
import RecuperacionLayout from '../layouts/RecuperacionLayout';
import { PasswordField } from '../components/Field';
import Button from '../components/Button';
import InfoBox from '../components/InfoBox';

const requisitos = ['Al menos 8 caracteres', 'Evita tu nombre y correo', 'No reutilices tu contraseña anterior'];

export default function NuevaContrasenaPage() {
  return (
    <RecuperacionLayout
      paso={3}
      titulo="Un nuevo comienzo."
      subtitulo="Elige una contraseña que solo tú conozcas."
      lateral={
        <div className="rounded-2xl bg-surface-muted p-6">
          <h2 className="text-heading-sm font-semibold text-text">Protege tu cuenta</h2>
          <p className="mt-3 text-label text-text-muted">
            Usa una contraseña distinta a la de otros servicios. No la envíes por WhatsApp ni la compartas con otras personas.
          </p>
          <p className="mt-4 text-small text-text-muted">¿El enlace ya no funciona?</p>
          <Button variant="secondary" size="lg" fullWidth className="mt-3">Solicitar un nuevo enlace</Button>
        </div>
      }
    >
      <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
        <form className="space-y-5">
          <PasswordField id="nueva" label="Nueva contraseña" defaultValue="••••••••••••" />

          <div>
            <p className="text-body-lg text-text-muted">Requisitos de contraseña</p>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-small text-success">
              {requisitos.map((r) => (
                <li key={r} className="inline-flex items-center gap-1">
                  <Check size={12} aria-hidden="true" /> {r}
                </li>
              ))}
            </ul>
          </div>

          <PasswordField
            id="confirmar"
            label="Confirmar nueva contraseña"
            defaultValue="••••••••••••"
            hint="Las contraseñas coinciden."
          />

          <Button type="submit" size="lg" fullWidth icon={Check}>Guardar nueva contraseña</Button>
        </form>

        <InfoBox tone="success" title="Contraseña actualizada" className="mt-5">
          Ya puedes ingresar con tu nueva contraseña. El enlace de recuperación dejó de ser válido.
        </InfoBox>
        <Button as="a" href="/ingresar" variant="secondary" size="lg" fullWidth className="mt-3">Ir a ingresar</Button>
      </section>
    </RecuperacionLayout>
  );
}
