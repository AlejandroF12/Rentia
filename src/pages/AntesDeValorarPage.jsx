import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Card from '../components/Card';
import Checkbox from '../components/Checkbox';
import InfoBox from '../components/InfoBox';

function Perfil() {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-14" />
      <div>
        <p className="text-heading-sm font-semibold text-text">Carlos Rojas</p>
        <p className="mt-1 text-small text-text-muted">Arrendador · Yopal, Casanare</p>
      </div>
    </div>
  );
}

function BloqueNormas({ titulo, children, boton }) {
  return (
    <div>
      <h3 className="text-heading-md font-semibold text-text">{titulo}</h3>
      <p className="mt-3 text-body-lg text-text-muted md:text-body">{children}</p>
      {boton && <Button type="button" variant="secondary" size="lg" fullWidth className="mt-4">{boton}</Button>}
    </div>
  );
}

/** Política de valoraciones (paso previo a valorar). */
export default function AntesDeValorarPage() {
  return (
    <DashboardLayout rol="cliente" activo="valoraciones">
      <PageHeader
        volver={{ to: '/cliente/valoraciones', texto: 'Volver a mis valoraciones' }}
        eyebrow="Política de valoraciones"
        titulo="La confianza empieza por la honestidad."
        subtitulo="Antes de valorar, confirma que conoces la experiencia que vas a compartir."
      />

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-6">
          <Card>
            <Perfil />
            <h2 className="mt-6 text-heading-lg font-semibold text-text md:text-heading-md">Valora el contacto, no un alquiler.</h2>
            <p className="mt-3 text-body-lg text-text-muted md:text-body">
              Comparte cómo fue la comunicación y la atención de Carlos. Tu opinión no prueba que se haya realizado un alquiler o un servicio.
            </p>

            <InfoBox title="WhatsApp no confirma contacto" className="mt-5">
              Tocar el botón de WhatsApp o de llamada no demuestra que hablaron. Rentia no lee ni rastrea mensajes externos.
            </InfoBox>

            <div className="mt-5 space-y-4">
              <Checkbox id="declaro-contacto" defaultChecked className="text-small">
                Declaro que tuve contacto directo previo con Carlos Rojas y que esta valoración refleja mi propia experiencia.
              </Checkbox>
              <Checkbox id="entiendo-normas" defaultChecked className="text-small">
                Entiendo que solo puedo tener una valoración por persona y que no debo incluir datos privados ni contenido abusivo.
              </Checkbox>
            </div>

            <div className="mt-5 space-y-3">
              <Button as={Link} to="/valoraciones/cliente-a-arrendador" size="lg" icon={ArrowRight} fullWidth>Continuar a valorar</Button>
              <Button as={Link} to="/cliente/valoraciones" variant="secondary" size="lg" fullWidth>No he tenido contacto · Volver</Button>
            </div>
          </Card>

          <Card className="space-y-6">
            <BloqueNormas titulo="Una opinión útil y respetuosa">
              Describe hechos que viviste, sin suplantar identidades ni atribuir experiencias a terceros. No publiques teléfonos, correos ni direcciones privadas.
            </BloqueNormas>
            <BloqueNormas titulo="Una valoración por contraparte" boton="Editar mi valoración existente">
              Si ya valoraste a Carlos, edita esa opinión en lugar de crear otra.
            </BloqueNormas>
            <BloqueNormas titulo="¿Una opinión incumple las normas?" boton="Reportar valoración abusiva">
              Reporta la valoración abusiva para revisión de administración. Reportar no elimina automáticamente la opinión.
            </BloqueNormas>
          </Card>
        </div>

        <aside className="hidden lg:block">
          <Card tone="muted">
            <h2 className="text-heading-md font-semibold text-text">¿Ya dejaste una opinión?</h2>
            <p className="mt-4 text-body text-text-muted">
              Solo puedes publicar una valoración por contraparte. Si tu experiencia cambió, edita la que ya existe en Mi espacio → Valoraciones → Enviadas.
            </p>
            <Button type="button" variant="secondary" size="lg" fullWidth className="mt-4">Editar mi valoración existente</Button>
            <p className="mt-5 text-body text-text-muted">
              Si una opinión contiene insultos o datos personales, usa “Reportar valoración” para solicitar revisión privada.
            </p>
            <Button type="button" variant="secondary" size="lg" fullWidth className="mt-4">Reportar valoración abusiva</Button>
          </Card>
        </aside>
      </div>
    </DashboardLayout>
  );
}
