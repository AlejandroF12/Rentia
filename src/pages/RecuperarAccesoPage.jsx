import { Mail, ArrowRight } from 'lucide-react';
import RecuperacionLayout from '../layouts/RecuperacionLayout';
import Field from '../components/Field';
import Button from '../components/Button';
import InfoBox from '../components/InfoBox';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../services/authService';

export default function RecuperarAccesoPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await requestPasswordReset(new FormData(event.currentTarget).get('correo'));
      navigate('/instrucciones-recuperacion');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RecuperacionLayout
      paso={1}
      titulo="Volvamos a hacer equipo."
      subtitulo="Solicita un enlace para crear una nueva contraseña."
      lateral={
        <>
          <h2 className="mt-5 text-heading-sm font-semibold text-text">El Llano nos mueve.</h2>
          <p className="mt-3 text-label text-text-muted">Tu cuenta reúne tus equipos, favoritos y valoraciones.</p>
          <InfoBox title="Cuida tu acceso" className="mt-5">
            Nunca compartas tu contraseña ni el enlace de recuperación.
          </InfoBox>
        </>
      }
    >
      <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
        <h2 className="text-heading-md font-semibold text-text">Recupera tu acceso</h2>
        <p className="mt-3 text-label text-text-muted md:text-body">
          Escribe el correo que usas en Rentia. Si está asociado a una cuenta, recibirás las instrucciones.
        </p>
        <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
          <Field id="correo" name="correo" label="Correo electrónico" type="email" required autoComplete="email" trailingIcon={Mail} />
          <Button type="submit" size="lg" fullWidth icon={ArrowRight} disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </Button>
          <Button as="a" href="/ingresar" variant="secondary" size="lg" fullWidth>Volver a ingresar</Button>
          {error && <p role="alert" className="text-small text-danger">{error}</p>}
        </form>
      </section>

      <InfoBox title="Tu información es privada" className="mt-5">
        Por seguridad, no confirmamos si un correo tiene una cuenta registrada.
      </InfoBox>
      <p className="mt-5 text-small text-text-muted">¿No recuerdas tu correo? Centro de ayuda → Recuperación de acceso.</p>
    </RecuperacionLayout>
  );
}
