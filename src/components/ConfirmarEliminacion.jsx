import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import Field from './Field';
import InfoBox from './InfoBox';

/**
 * Bloque de confirmación para eliminar un equipo (se usa en su propia página
 * y, cuando se active, dentro de "Gestionar publicación").
 * resultado: muestra el aviso de éxito y el botón "Volver a mis equipos".
 */
export default function ConfirmarEliminacion({ nombre = 'CAT 420F', resultado = false, className = '' }) {
  return (
    <Card tone="danger" className={className}>
      <h2 className="text-heading-lg font-semibold text-text">¿Eliminar {nombre} definitivamente?</h2>
      <p className="mt-3 text-body-lg text-text-muted">
        Se retirarán la publicación y sus fotos. No podrás recuperarlas ni volver a publicar esta misma ficha. Tu cuenta y tus otras publicaciones no se eliminan.
      </p>

      <Field id="confirmar-eliminar" label="Escribe ELIMINAR para continuar" defaultValue="ELIMINAR" className="mt-6 [&_label]:text-small [&_input]:h-11" />
      <Checkbox id="entiende-eliminar" defaultChecked className="mt-4 text-small">
        Entiendo que esta acción es permanente y no se puede deshacer.
      </Checkbox>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
        <Button as={Link} to="/arrendador/equipos/gestionar" variant="secondary" size="lg" className="w-full md:w-auto">
          Cancelar y conservar equipo
        </Button>
        <button type="button" className="inline-flex items-center justify-center gap-2 py-2 text-label font-semibold text-danger">
          <Trash2 size={14} aria-hidden="true" /> Sí, eliminar definitivamente
        </button>
      </div>

      {resultado && (
        <div className="mt-6 space-y-4">
          <InfoBox tone="success" title="Resultado al confirmar: publicación eliminada">
            {nombre} se retiró definitivamente del catálogo y de Mis equipos. Tus otras publicaciones no cambiaron.
          </InfoBox>
          <Button as={Link} to="/arrendador/equipos" variant="secondary" size="lg" className="w-full md:w-auto">
            Volver a mis equipos
          </Button>
        </div>
      )}
    </Card>
  );
}
