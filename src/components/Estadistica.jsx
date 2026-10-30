/**
 * Tarjeta con una cifra grande (paneles de administración).
 * icono: opcional, solo se muestra en escritorio (esquina superior derecha).
 */
export default function Estadistica({ valor, etiqueta, etiquetaMovil, icono: Icono }) {
  return (
    <div className="relative rounded-2xl border border-border bg-surface p-4 md:p-6">
      {Icono && <Icono size={18} aria-hidden="true" className="absolute right-6 top-6 hidden text-text-muted md:block" />}
      <p className="text-title-mobile font-semibold text-primary">{valor}</p>
      <p className="mt-1 text-small text-text-muted md:text-body">{etiquetaMovil ? (
          <>
            <span className="md:hidden">{etiquetaMovil}</span>
            <span className="hidden md:inline">{etiqueta}</span>
          </>
        ) : (
          etiqueta
        )}
      </p>
    </div>
  );
}
