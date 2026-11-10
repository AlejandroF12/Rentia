import { Accessibility, Moon, Sparkles, Sun } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import Toggle from '../components/Toggle';

function PreferenceRow({ icon: Icon, title, description, checked, onChange, label }) {
  return (
    <div className="flex items-start justify-between gap-5 py-5">
      <div className="flex min-w-0 gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-primary">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-label font-semibold text-text">{title}</h2>
          <p className="mt-1 max-w-prose text-small leading-relaxed text-text-muted">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} label={label} onChange={onChange} className="mt-2" />
    </div>
  );
}

export default function PreferenciasPage() {
  const { darkMode, reduceMotion, error, setPreference } = usePreferences();

  return (
    <div className="min-h-[70vh] bg-background font-sans text-text">
      <main className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
        <PageHeader
          eyebrow="Tu experiencia"
          titulo="Personaliza Rentia a tu manera."
          subtitulo="Ajusta la apariencia y el movimiento de la interfaz. Estos cambios se guardan en este navegador."
        />
        <Card className="mt-8 divide-y divide-border px-5 md:px-8">
          <PreferenceRow
            icon={darkMode ? Moon : Sun}
            title="Modo oscuro"
            description="Usa una paleta oscura más cómoda en entornos con poca luz. El cambio se aplica en toda la plataforma."
            checked={darkMode}
            label="Activar modo oscuro"
            onChange={() => setPreference('darkMode', !darkMode)}
          />
          <PreferenceRow
            icon={reduceMotion ? Accessibility : Sparkles}
            title="Reducir animaciones"
            description="Reduce los movimientos decorativos y las transiciones. Rentia también respeta el ajuste de movimiento reducido de tu dispositivo."
            checked={reduceMotion}
            label="Reducir animaciones"
            onChange={() => setPreference('reduceMotion', !reduceMotion)}
          />
        </Card>
        <p className="mt-5 text-small text-text-muted" role={error ? 'alert' : 'status'} aria-live="polite">
          {error || 'Tus preferencias se guardan automáticamente en este navegador.'}
        </p>
      </main>
    </div>
  );
}
