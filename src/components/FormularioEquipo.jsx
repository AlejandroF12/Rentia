import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, ImagePlus, Lightbulb, X } from 'lucide-react';
import Badge, { EstadoBadge } from './Badge';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import Field from './Field';
import ImagenNoEncontrada from './ImagenNoEncontrada';
import InfoBox from './InfoBox';
import MapaEstatico from './MapaEstatico';
import Select from './Select';
import Textarea from './Textarea';
import Toggle from './Toggle';
import { categoriasEquipo, municipios } from '../data/panel';
import { useAuth } from '../context/AuthContext';
import { createEquipment } from '../services/equipmentService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Formulario de vehículo. Un solo componente para tres pantallas:
 *  - modo="agregar"  · Agregar vehículo
 *  - modo="editar"   · Editar vehículo
 *  - modo="revision" · Validación al publicar (con errores)
 * errores: { fotos, categoria, municipio } con el texto de cada error.
 * resultado: muestra el aviso "Equipo publicado correctamente" (solo móvil en el diseño).
 * Aún sin estado ni envío: todos los botones son type="button".
 */

function TituloSeccion({ numero, chip, children }) {
  return (
    <h2 className="flex items-center gap-3 text-heading-lg font-semibold text-text md:text-heading-md">
      {chip && (
        <span className="hidden size-6 items-center justify-center rounded-md bg-surface-muted text-caption font-semibold text-text-muted md:flex">
          {numero}
        </span>
      )}
      <span>
        <span className={chip ? 'md:hidden' : ''}>{numero} · </span>
        {children}
      </span>
    </h2>
  );
}

function Foto({ indice }) {
  const portada = indice === 0;
  return (
    <div>
      <div className="relative">
        <ImagenNoEncontrada className="aspect-[16/9] w-full rounded-xl md:aspect-[3/2]" />
        <button
          type="button"
          aria-label={`Quitar foto ${indice + 1}`}
          className="absolute right-2 top-2 hidden size-6 items-center justify-center rounded-full bg-surface text-text md:flex"
        >
          <X size={12} aria-hidden="true" />
        </button>
        {portada && (
          <span className="absolute bottom-2 left-2 hidden rounded bg-surface px-2 py-1 text-caption font-semibold text-text md:block">Portada</span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between text-small text-text-muted md:hidden">
        <span>{portada ? 'Portada · Foto 1' : `Foto ${indice + 1}`}</span>
        <button type="button" className="inline-flex items-center gap-1 font-medium text-text">
          Quitar <X size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function SeccionFotos({ equipo, revision, error }) {
  return (
    <Card>
      <TituloSeccion numero="01" chip={!revision}>Muestra tu equipo</TituloSeccion>
      <p className="mt-2 text-body-lg text-text-muted md:text-body">
        {revision ? (
          'Agrega de 1 a 8 fotos propias. La primera será la portada.'
        ) : (
          <>
            <span className="md:hidden">Agrega de 1 a 8 fotos propias. La primera será la portada.</span>
            <span className="hidden md:inline">Agrega hasta 8 fotos. La primera será la portada.</span>
          </>
        )}
      </p>

      {error ? (
        <>
          <div className="mt-5 flex flex-col items-center gap-4 rounded-xl border border-dashed border-danger px-4 py-8 md:py-10">
            <ImagePlus size={20} aria-hidden="true" className="hidden text-text-muted md:block" />
            <p className="text-label font-semibold text-text-muted">Sin fotos todavía</p>
            <Button type="button" variant="secondary" size="lg" icon={ImagePlus} className="w-full md:w-auto">
              <span className="md:hidden">Agregar fotos</span>
              <span className="hidden md:inline">Agregar fotos del equipo</span>
            </Button>
          </div>
          <p className="mt-3 text-small text-danger">{error}</p>
        </>
      ) : (
        <div className="mt-5 flex flex-col gap-3 md:grid md:grid-cols-3">
          {Array.from({ length: equipo.fotos }).map((_, i) => (
            <Foto key={i} indice={i} />
          ))}
          <button
            type="button"
            className="hidden aspect-[3/2] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary-alpha-40 text-small text-text md:flex"
          >
            <ImagePlus size={18} aria-hidden="true" />
            Agregar fotos
          </button>
          <Button type="button" variant="secondary" size="lg" icon={ImagePlus} fullWidth className="md:hidden">
            Agregar fotos
          </Button>
        </div>
      )}

      <p className="mt-4 text-small text-text-muted">
        {revision ? (
          'JPG o PNG · Máximo 10 MB por foto. Solo fotos de maquinaria; no documentos.'
        ) : (
          <>
            <span className="md:hidden">JPG o PNG · Máximo 10 MB por foto. Solo fotos de maquinaria; no documentos.</span>
            <span className="hidden md:inline">JPG o PNG · Máximo 10 MB por foto · {equipo.fotos} de 8 fotos</span>
          </>
        )}
      </p>
    </Card>
  );
}

function SeccionDatos({ equipo, revision, errores }) {
  return (
    <Card>
      <TituloSeccion numero="02" chip={!revision}>Cuéntanos sobre tu equipo</TituloSeccion>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field id="nombre" name="nombre" label="Nombre del vehículo o maquinaria *" defaultValue={equipo.nombre} required className="md:col-span-2" />
        <Select id="categoria" name="categoria" label="Categoría *" defaultValue={errores.categoria ? '' : equipo.categoria} required error={errores.categoria}>
          <option value="" disabled>Selecciona una categoría</option>
          {categoriasEquipo.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Field id="marca" name="marca" label="Marca y modelo" defaultValue={equipo.marca} />
        <Field id="anio" name="anio" label="Año" defaultValue={equipo.anio} inputMode="numeric" />
        <Field id="caracteristica" name="caracteristica" label="Característica principal" defaultValue={equipo.caracteristica} />
        <Textarea id="descripcion" name="descripcion" label="Descripción *" rows={4} defaultValue={equipo.descripcion} required className="md:col-span-2" />
      </div>
    </Card>
  );
}

function SeccionUbicacion({ equipo, revision, errores }) {
  return (
    <Card>
      <TituloSeccion numero="03" chip={!revision}>¿Dónde se encuentra?</TituloSeccion>
      <p className="mt-2 text-body-lg text-text-muted md:text-body">Solo mostraremos una ubicación aproximada en el catálogo.</p>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Select id="municipio" name="municipio" label="Municipio *" defaultValue={errores.municipio ? '' : equipo.municipio} required error={errores.municipio}>
          <option value="" disabled>Selecciona un municipio</option>
          {municipios.map((m) => <option key={m} value={m}>{m}</option>)}
        </Select>
        <Field id="sector" name="sector" label="Sector o vereda" defaultValue={equipo.sector} />
      </div>

      <MapaEstatico municipio={equipo.municipioCorto} sector={revision ? '' : equipo.sector} className="mt-5 h-44 md:h-[190px]" />

      <div className="mt-3 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-small text-text-muted">
          {revision
            ? 'Mapa estático. El punto lo defines tú; no hay seguimiento GPS ni ubicación en tiempo real.'
            : 'El mapa es estático. No muestra tu ubicación en tiempo real.'}
        </p>
        {revision ? (
          <Button type="button" variant="secondary" size="lg" className="w-full md:w-auto">Fijar punto manual</Button>
        ) : (
          <>
            <Button type="button" variant="secondary" size="lg" fullWidth trailingIcon={ArrowUpRight} className="md:hidden">
              Ajustar punto manual
            </Button>
            <button type="button" className="hidden items-center gap-1 text-small font-semibold text-text md:inline-flex">
              Ajustar punto <ArrowUpRight size={12} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </Card>
  );
}

function PanelDisponibilidad({ equipo, revision }) {
  return (
    <Card className="p-5">
      <h2 className="text-body-lg font-semibold text-text md:text-heading-sm">Disponibilidad</h2>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-label text-text">Equipo disponible</span>
        <Toggle checked={equipo.disponible} label="Equipo disponible" />
      </div>
      <p className="mt-3 text-small text-text-muted">
        {revision ? (
          'Estado indicado por ti. No es un calendario de reservas. Acuerda operación y traslado directamente con cada cliente.'
        ) : (
          <>
            <span className="lg:hidden">Estado indicado por ti. No es un calendario de reservas. Acuerda operación y traslado directamente con cada cliente.</span>
            <span className="hidden lg:inline">Este estado orienta a los clientes. Puedes cambiarlo en cualquier momento.</span>
          </>
        )}
      </p>
      <Checkbox id="autoriza-celular" defaultChecked className={`mt-4 text-small ${revision ? '' : 'lg:hidden'}`}>
        Autorizo mostrar mi celular {equipo.celular} para WhatsApp y llamadas.
      </Checkbox>
    </Card>
  );
}

function PanelAyuda({ modo }) {
  const nota = {
    agregar: 'Tu borrador no es visible hasta que lo publiques.',
    editar: 'Los cambios se verán al guardar.',
  }[modo];
  return (
    <InfoBox icon={Lightbulb} title="Lo claro genera confianza.">
      {modo === 'revision' ? (
        'Usa fotos propias, describe el estado real y revisa las Normas de publicación antes de continuar.'
      ) : (
        <>
          Usa fotografías propias y describe el estado real de tu equipo. Los clientes te contactarán por WhatsApp o llamada.
          <span className="mt-2 block text-text-muted">{nota}</span>
        </>
      )}
    </InfoBox>
  );
}

function PanelResumen({ equipo, modo }) {
  if (modo === 'revision') {
    return (
      <Card className="p-5">
        <p className="text-label font-semibold text-text">Carlos Rojas</p>
        <p className="mt-5 text-heading-md font-semibold text-text">{equipo.nombre}</p>
        <p className="mt-5 text-small text-text-muted">Tu borrador no es visible hasta que lo publiques.</p>
      </Card>
    );
  }
  return (
    <Card className="p-4">
      <p className="text-label font-semibold text-text">Así verán tu equipo</p>
      <ImagenNoEncontrada className="mt-3 aspect-[4/3] w-full rounded-xl" />
      <EstadoBadge disponible={equipo.disponible} className="mt-3" />
      <p className="mt-3 text-heading-md font-semibold text-text">{equipo.nombre}</p>
      <p className="mt-3 text-small text-text-muted">{equipo.municipio}</p>
      <p className="mt-4 text-caption text-text-muted">Publicado por Carlos Rojas</p>
    </Card>
  );
}

function AccionesEscritorio({ modo, submitting }) {
  return (
    <div className="mt-6 hidden lg:block">
      <div className="flex items-center justify-between gap-3">
        {modo === 'revision' ? (
          <Button as={Link} to="/arrendador/equipos" variant="secondary" size="lg">Cancelar y volver a mis equipos</Button>
        ) : (
          <Link to="/arrendador/equipos" className="text-label text-text-muted">Cancelar</Link>
        )}
        <div className="flex items-center gap-3">
          {modo === 'editar' ? (
            <>
              <Button as={Link} to="/arrendador/equipos/gestionar" variant="secondary" size="lg">Ver publicación</Button>
              <Button type="submit" size="lg" icon={Check} disabled={submitting}>Guardar cambios</Button>
            </>
          ) : (
            <>
              <Button type="button" variant="secondary" size="lg">Guardar borrador</Button>
              <Button type="submit" size="lg" icon={Check} disabled={submitting}>{submitting ? 'Publicando...' : 'Publicar equipo'}</Button>
            </>
          )}
        </div>
      </div>
      {modo === 'revision' && (
        <p className="mt-4 text-small text-text-muted">Tu borrador puede guardarse sin publicar. Corrige los campos indicados y vuelve a intentarlo.</p>
      )}
    </div>
  );
}

function AccionesMovil({ modo, resultado, equipo, submitting }) {
  const editar = modo === 'editar';
  return (
    <div className="mt-6 flex flex-col gap-3 lg:hidden">
      <Button type="submit" size="lg" icon={Check} fullWidth disabled={submitting}>{submitting ? 'Publicando...' : editar ? 'Guardar cambios' : 'Publicar equipo'}</Button>
      {editar ? (
        <Button as={Link} to="/arrendador/equipos/gestionar" variant="secondary" size="lg" fullWidth>Ver publicación</Button>
      ) : (
        <Button type="button" variant="secondary" size="lg" fullWidth>Guardar borrador</Button>
      )}
      {modo === 'revision' && (
        <p className="text-small text-text-muted">Tu borrador puede guardarse sin publicar. Corrige los campos indicados y vuelve a intentarlo.</p>
      )}
      {resultado && (
        <InfoBox tone="success" title="Equipo publicado correctamente">
          {equipo.nombre} ya puede verse en el catálogo. Ver publicación →
        </InfoBox>
      )}
      <Button as={Link} to="/arrendador/equipos" variant="secondary" size="lg" fullWidth>Cancelar y volver a mis equipos</Button>
    </div>
  );
}

export default function FormularioEquipo({ modo = 'agregar', equipo, errores = {}, resultado = false }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const revision = modo === 'revision';
  const cuenta = Object.values(errores).filter(Boolean).length;
  const insignia = revision
    ? <Badge tone="warning">Borrador sin publicar</Badge>
    : modo === 'editar'
      ? <Badge tone="success">Publicada</Badge>
      : <Badge tone="warning">Borrador sin publicar</Badge>;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      await createEquipment(session.user.id, {
        name: formData.get('nombre'),
        category: formData.get('categoria'),
        brand: formData.get('marca'),
        model: '',
        modelYear: formData.get('anio'),
        mainFeature: formData.get('caracteristica'),
        description: formData.get('descripcion'),
        municipality: formData.get('municipio'),
        sector: formData.get('sector'),
        isAvailable: true,
      });
      navigate('/arrendador/equipos');
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitError && <p role="alert" className="mt-6 text-small text-danger">{submitError}</p>}
      {revision && cuenta > 0 && (
        <InfoBox tone="danger" title={`Revisa ${cuenta} campos para publicar`} className="mt-6 md:mt-8">
          Faltan fotos del equipo, categoría y ubicación. Conservamos los datos que ya escribiste.
        </InfoBox>
      )}

      {revision && <div className="mt-5 lg:hidden">{insignia}</div>}

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <div className="space-y-6">
            <SeccionFotos equipo={equipo} revision={revision} error={errores.fotos} />
            <SeccionDatos equipo={equipo} revision={revision} errores={errores} />
            <SeccionUbicacion equipo={equipo} revision={revision} errores={errores} />
          </div>
          <AccionesEscritorio modo={modo} submitting={submitting} />
        </div>

        <aside className="space-y-4">
          {revision && <div className="hidden lg:block">{insignia}</div>}
          <div className="hidden lg:block"><PanelResumen equipo={equipo} modo={modo} /></div>
          <PanelDisponibilidad equipo={equipo} revision={revision} />
          <PanelAyuda modo={modo} />
        </aside>
      </div>

      <AccionesMovil modo={modo} resultado={resultado} equipo={equipo} submitting={submitting} />
    </form>
  );
}
