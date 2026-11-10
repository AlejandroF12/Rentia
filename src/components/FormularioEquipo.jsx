import { Link } from 'react-router-dom';
import { Check, ImagePlus, Lightbulb, Save, X } from 'lucide-react';
import Badge, { EstadoBadge } from './Badge';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import Field from './Field';
import ImagenNoEncontrada from './ImagenNoEncontrada';
import InfoBox from './InfoBox';
import MapaSeleccionUbicacion from './MapaSeleccionUbicacion';
import { getMunicipalityCoordinates } from '../utils/location';
import Select from './Select';
import Textarea from './Textarea';
import Toggle from './Toggle';
import { categoriasEquipo } from '../data/panel';
import { useAuth } from '../context/AuthContext';
import { createEquipment, updateEquipment, uploadEquipmentImages, deleteEquipmentImage } from '../services/equipmentService';
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

function Foto({ image, indice, onRemove }) {
  const portada = indice === 0;
  return (
    <div>
      <div className="relative">
        <img src={image.url} alt={`Foto ${indice + 1}`} className="aspect-[16/9] w-full rounded-xl object-cover md:aspect-[3/2]" />
        <button
          type="button"
          aria-label={`Quitar foto ${indice + 1}`}
          onClick={() => onRemove(image)}
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
        <button type="button" onClick={() => onRemove(image)} className="inline-flex items-center gap-1 font-medium text-text">
          Quitar <X size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function SeccionFotos({ revision, error, images, onAdd, onRemove }) {
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
            <Button as="label" variant="secondary" size="lg" icon={ImagePlus} className="w-full cursor-pointer md:w-auto">
              <span className="md:hidden">Agregar fotos</span>
              <span className="hidden md:inline">Agregar fotos del equipo</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onAdd} className="sr-only" />
            </Button>
          </div>
          <p className="mt-3 text-small text-danger">{error}</p>
        </>
      ) : (
        <div className="mt-5 flex flex-col gap-3 md:grid md:grid-cols-3">
          {images.map((image, i) => (
            <Foto key={image.id || image.url} image={image} indice={i} onRemove={onRemove} />
          ))}
          <label className="hidden aspect-[3/2] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary-alpha-40 text-small text-text md:flex">
            <ImagePlus size={18} aria-hidden="true" />
            Agregar fotos
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onAdd} className="sr-only" />
          </label>
          <Button as="label" variant="secondary" size="lg" icon={ImagePlus} fullWidth className="cursor-pointer md:hidden">
            Agregar fotos
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onAdd} className="sr-only" />
          </Button>
        </div>
      )}

      <p className="mt-4 text-small text-text-muted">
        {revision ? (
          'JPG o PNG · Máximo 10 MB por foto. Solo fotos de maquinaria; no documentos.'
        ) : (
          <>
            <span className="md:hidden">JPG o PNG · Máximo 10 MB por foto. Solo fotos de maquinaria; no documentos.</span>
            <span className="hidden md:inline">JPG o PNG · Máximo 10 MB por foto · {images.length} de 8 fotos</span>
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
        <Field id="nombre" name="nombre" label="Nombre del vehículo o maquinaria *" defaultValue={equipo.nombre} aria-required="true" error={errores.nombre} className="md:col-span-2" />
        <Select id="categoria" name="categoria" label="Categoría *" defaultValue={errores.categoria ? '' : equipo.categoria} aria-required="true" error={errores.categoria}>
          <option value="" disabled>Selecciona una categoría</option>
          {categoriasEquipo.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Field id="marca" name="marca" label="Marca y modelo" defaultValue={equipo.marca} />
        <Field id="anio" name="anio" label="Año" defaultValue={equipo.anio} inputMode="numeric" />
        <Field id="caracteristica" name="caracteristica" label="Característica principal" defaultValue={equipo.caracteristica} />
        <Textarea id="descripcion" name="descripcion" label="Descripción *" rows={4} defaultValue={equipo.descripcion} aria-required="true" error={errores.descripcion} className="md:col-span-2" />
      </div>
    </Card>
  );
}

function SeccionUbicacion({ revision, errores, location, municipality, sector, onLocationChange, onMunicipalityStatusChange }) {
  const municipalityCoordinates = getMunicipalityCoordinates(municipality);
  return (
    <Card>
      <TituloSeccion numero="03" chip={!revision}>¿Dónde se encuentra?</TituloSeccion>
      <p className="mt-2 text-body-lg text-text-muted md:text-body">Solo mostraremos una ubicación aproximada en el catálogo.</p>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field
          id="municipio"
          name="municipio"
          label="Municipio *"
          value={municipality}
          aria-required="true"
          error={errores.municipio}
          hintClassName="rounded-md border border-primary bg-primary-alpha-14 px-3 py-2 font-semibold text-text"
          onChange={(event) => {
            onMunicipalityStatusChange('manual');
            onLocationChange({ municipality: event.target.value });
          }}
          hint="Puedes corregir este campo si la ubicación no coincide."
        />
        <Field id="sector" name="sector" label="Sector o vereda" value={sector} onChange={(event) => onLocationChange({ sector: event.target.value })} />
      </div>

      <MapaSeleccionUbicacion
        key={municipality}
        municipality={municipality}
        latitude={location.latitude ?? municipalityCoordinates[0]}
        longitude={location.longitude ?? municipalityCoordinates[1]}
        onChange={onLocationChange}
        onDetectionStatus={onMunicipalityStatusChange}
      />
      <input type="hidden" name="latitude" value={location.latitude ?? municipalityCoordinates[0]} />
      <input type="hidden" name="longitude" value={location.longitude ?? municipalityCoordinates[1]} />

      <div className="mt-3 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-small text-text-muted">
          {revision
            ? 'Elige el punto en el mapa o usa el GPS. Solo mostraremos una ubicación aproximada.'
            : 'Puedes fijar el punto manualmente o usar el GPS del dispositivo.'}
        </p>
      </div>
    </Card>
  );
}

function PanelDisponibilidad({ equipo, revision, disponible, onAvailabilityChange }) {
  return (
    <Card className="p-5">
      <h2 className="text-body-lg font-semibold text-text md:text-heading-sm">Disponibilidad</h2>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-label text-text">Equipo disponible</span>
        <Toggle checked={disponible} label="Equipo disponible" onChange={onAvailabilityChange} />
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
        Autorizo mostrar mi celular {equipo.celular || 'registrado en mi perfil'} para WhatsApp y llamadas.
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

function PanelResumen({ equipo, modo, ownerName }) {
  if (modo === 'revision') {
    return (
      <Card className="p-5">
        <p className="text-label font-semibold text-text">{ownerName || 'Tu perfil'}</p>
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
      <p className="mt-4 text-caption text-text-muted">Publicado por {ownerName || 'tu perfil'}</p>
    </Card>
  );
}

function AccionesEscritorio({ modo, submitting, equipo, publicationStatus }) {
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
              {publicationStatus === 'publicada' && (
                <Button as={Link} to={`/detalle-equipo?id=${encodeURIComponent(equipo.id || '')}`} variant="secondary" size="lg">Ver publicación</Button>
              )}
              {publicationStatus === 'borrador' ? (
                <>
                  <Button type="submit" name="action" value="borrador" formNoValidate variant="secondary" size="lg" icon={Save} className="action-save" disabled={submitting}>Guardar borrador</Button>
                  <Button type="submit" name="action" value="publicar" size="lg" icon={Check} className="action-publish" disabled={submitting}>Publicar equipo</Button>
                </>
              ) : (
                <>
                  <Button type="submit" name="action" value="borrador" formNoValidate variant="secondary" size="lg" icon={Save} className="action-save" disabled={submitting}>Guardar como borrador</Button>
                  <Button type="submit" name="action" value="guardar" size="lg" icon={Check} className="action-save" disabled={submitting}>Guardar cambios</Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button type="submit" formNoValidate name="action" value="borrador" variant="secondary" size="lg" icon={Save} className="action-save" disabled={submitting}>Guardar borrador</Button>
              <Button type="submit" size="lg" icon={Check} className="action-publish" disabled={submitting}>{submitting ? 'Publicando...' : 'Publicar equipo'}</Button>
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

function AccionesMovil({ modo, resultado, equipo, submitting, publicationStatus }) {
  const editar = modo === 'editar';
  return (
    <div className="mt-6 flex flex-col gap-3 lg:hidden">
      <Button type="submit" name="action" value={editar ? (publicationStatus === 'borrador' ? 'publicar' : 'guardar') : 'publicar'} size="lg" icon={Check} className={editar && publicationStatus !== 'borrador' ? 'action-save' : 'action-publish'} fullWidth disabled={submitting}>{submitting ? 'Guardando...' : editar ? (publicationStatus === 'borrador' ? 'Publicar equipo' : 'Guardar cambios') : 'Publicar equipo'}</Button>
      {editar ? (
        publicationStatus === 'borrador' ? (
          <Button type="submit" name="action" value="borrador" formNoValidate variant="secondary" size="lg" icon={Save} className="action-save" fullWidth disabled={submitting}>Guardar borrador</Button>
        ) : (
          <>
            <Button as={Link} to={`/detalle-equipo?id=${encodeURIComponent(equipo.id || '')}`} variant="secondary" size="lg" fullWidth>Ver publicación</Button>
            <Button type="submit" name="action" value="borrador" formNoValidate variant="secondary" size="lg" icon={Save} className="action-save" fullWidth disabled={submitting}>Guardar como borrador</Button>
          </>
        )
      ) : (
        <Button type="submit" formNoValidate name="action" value="borrador" variant="secondary" size="lg" icon={Save} className="action-save" fullWidth disabled={submitting}>Guardar borrador</Button>
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
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState(equipo.imagenes || []);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [disponible, setDisponible] = useState(equipo.is_available ?? equipo.disponible ?? true);
  const [location, setLocation] = useState({
    latitude: equipo.latitude ?? null,
    longitude: equipo.longitude ?? null,
  });
  const [municipality, setMunicipality] = useState(equipo.municipio || '');
  const [sector, setSector] = useState(equipo.sector || '');
  const [municipalityStatus, setMunicipalityStatus] = useState(equipo.municipio ? 'initial' : 'not-found');
  const handleLocationChange = (changes) => {
    setLocation((current) => ({
      latitude: changes.latitude ?? current.latitude,
      longitude: changes.longitude ?? current.longitude,
    }));
    if (changes.municipality !== undefined) setMunicipality(changes.municipality);
    if (changes.sector !== undefined) setSector(changes.sector);
  };
  const revision = modo === 'revision';
  const cuenta = Object.values(errores).filter(Boolean).length;
  const publicationStatus = equipo?.publication_status || (revision ? 'borrador' : 'borrador');
  const insignia = revision
    ? <Badge tone="warning">Borrador sin publicar</Badge>
    : modo === 'editar'
      ? <Badge tone={publicationStatus === 'publicada' ? 'success' : 'warning'}>{publicationStatus === 'publicada' ? 'Publicada' : 'Borrador sin publicar'}</Badge>
      : <Badge tone="warning">Borrador sin publicar</Badge>;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    const formData = new FormData(event.currentTarget);
    const isDraft = event.nativeEvent.submitter?.value === 'borrador';
    const nextErrors = {};
    if (!isDraft) {
      if (!images.length) nextErrors.fotos = 'Agrega al menos una foto del equipo para publicarlo.';
      if (!String(formData.get('nombre') || '').trim()) nextErrors.nombre = 'Ingresa el nombre del equipo.';
      if (!formData.get('categoria')) nextErrors.categoria = 'Selecciona una categoría.';
      if (!String(formData.get('descripcion') || '').trim()) nextErrors.descripcion = 'Describe el equipo antes de publicarlo.';
      if (!String(formData.get('municipio') || '').trim()) nextErrors.municipio = 'Ingresa el municipio del equipo.';
    }
    setValidationErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setSubmitError('Corrige los campos indicados antes de publicar.');
      return;
    }
    setSubmitting(true);
    try {
      const values = {
        name: formData.get('nombre'),
        category: formData.get('categoria'),
        brand: formData.get('marca'),
        model: '',
        modelYear: formData.get('anio'),
        mainFeature: formData.get('caracteristica'),
        description: formData.get('descripcion'),
        municipality: formData.get('municipio'),
        sector: formData.get('sector'),
        isAvailable: disponible,
        latitude: formData.get('latitude'),
        longitude: formData.get('longitude'),
      };
      const publicationAction = event.nativeEvent.submitter?.value;
      if (modo === 'editar') {
        await updateEquipment(equipo.id, session.user.id, values, publicationAction === 'publicar' ? 'publicada' : publicationAction === 'borrador' ? 'borrador' : undefined);
        if (pendingFiles.length) {
          const uploaded = await uploadEquipmentImages(equipo.id, pendingFiles);
          setImages((current) => [...current, ...uploaded]);
          setPendingFiles([]);
        }
      } else {
        const created = await createEquipment(session.user.id, values, isDraft ? 'borrador' : 'publicada');
        if (pendingFiles.length) await uploadEquipmentImages(created.id, pendingFiles);
      }
      navigate('/arrendador/equipos');
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddImages = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);
    setPendingFiles((current) => [...current, ...validFiles].slice(0, 8 - images.length));
    setImages((current) => [...current, ...validFiles.map((file) => ({ id: `pending-${file.name}-${file.lastModified}`, url: URL.createObjectURL(file), pending: true }))].slice(0, 8));
    event.target.value = '';
  };

  const handleRemoveImage = async (image) => {
    if (image.pending) {
      setPendingFiles((current) => current.filter((file) => `pending-${file.name}-${file.lastModified}` !== image.id));
      setImages((current) => current.filter((item) => item.id !== image.id));
      return;
    }
    try {
      await deleteEquipmentImage(image);
      setImages((current) => current.filter((item) => item.id !== image.id));
    } catch (imageError) {
      setSubmitError(imageError.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitError && <p role="alert" className="mt-6 text-small text-danger">{submitError}</p>}
      {(revision && cuenta > 0) && (
        <InfoBox tone="danger" title={`Revisa ${cuenta} campos para publicar`} className="mt-6 md:mt-8">
          Faltan fotos del equipo, categoría y ubicación. Conservamos los datos que ya escribiste.
        </InfoBox>
      )}

      {revision && <div className="mt-5 lg:hidden">{insignia}</div>}

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_288px] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <div className="space-y-6">
            <SeccionFotos revision={revision} error={validationErrors.fotos || errores.fotos} images={images} onAdd={handleAddImages} onRemove={handleRemoveImage} />
            <SeccionDatos equipo={equipo} revision={revision} errores={{ ...errores, ...validationErrors }} />
            <SeccionUbicacion
              revision={revision}
              errores={{ ...errores, ...validationErrors }}
              location={location}
              municipality={municipality}
              sector={sector}
              municipalityStatus={municipalityStatus}
              onLocationChange={handleLocationChange}
              onMunicipalityStatusChange={setMunicipalityStatus}
            />
          </div>
          <AccionesEscritorio modo={modo} submitting={submitting} equipo={equipo} publicationStatus={publicationStatus} />
        </div>

        <aside className="space-y-4">
          {revision && <div className="hidden lg:block">{insignia}</div>}
          <div className="hidden lg:block"><PanelResumen equipo={{ ...equipo, disponible }} modo={modo} ownerName={profile?.full_name} /></div>
          <PanelDisponibilidad equipo={equipo} revision={revision} disponible={disponible} onAvailabilityChange={() => setDisponible((value) => !value)} />
          <PanelAyuda modo={modo} />
        </aside>
      </div>

      <AccionesMovil modo={modo} resultado={resultado} equipo={equipo} submitting={submitting} publicationStatus={publicationStatus} />
    </form>
  );
}
