import { MailCheck, ArrowUpRight } from 'lucide-react';
import RecuperacionLayout from '../layouts/RecuperacionLayout';
import Button from '../components/Button';
import InfoBox from '../components/InfoBox';

export default function InstruccionesRecuperacionPage() {
  return (
    <RecuperacionLayout
      paso={2}
      titulo="Revisa tu correo."
      subtitulo="Un paso más para volver a tu espacio."
      lateral={
        <div className="rounded-2xl bg-surface-muted p-6">
          <h2 className="text-heading-sm font-semibold text-text">¿No ves el mensaje?</h2>
          <p className="mt-3 text-label text-text-muted">
            Revisa correo no deseado y comprueba la dirección que escribiste. Espera unos minutos antes de solicitar otro enlace.
          </p>
          <Button variant="secondary" size="lg" fullWidth trailingIcon={ArrowUpRight} className="mt-5">Centro de ayuda</Button>
        </div>
      }
    >
      <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
        <span className="flex size-14 items-center justify-center rounded-full bg-success-subtle text-accent">
          <MailCheck size={24} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-heading-md font-semibold text-text">Solicitud recibida</h2>
        <p className="mt-3 text-label text-text-muted md:text-body">
          Si el correo que ingresaste está asociado a una cuenta, recibirás un enlace para cambiar tu contraseña.
        </p>
        <InfoBox title="Por seguridad" className="mt-5">
          Esta confirmación es la misma para todos los correos. No revela si existe una cuenta.
        </InfoBox>
        <p className="mt-5 text-caption text-text-muted">El enlace es de un solo uso. Si ya no funciona, solicita uno nuevo.</p>
        <div className="mt-4 space-y-3">
          <Button as="a" href="/ingresar" size="lg" fullWidth>Volver a ingresar</Button>
          <Button as="a" href="/recuperar-acceso" variant="secondary" size="lg" fullWidth>Usar otro correo</Button>
          <Button as="a" href="/recuperar-acceso" variant="secondary" size="lg" fullWidth>Solicitar otro enlace</Button>
        </div>
      </section>
    </RecuperacionLayout>
  );
}
