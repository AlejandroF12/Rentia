import { Link } from 'react-router-dom';
import { ArrowUpRight, CircleHelp, FileText, KeyRound, ShieldCheck } from 'lucide-react';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import { PaginaCuenta } from '../layouts/DashboardLayout';

const helpTopics = [
  {
    id: 'acceso',
    icon: KeyRound,
    title: 'Acceso a tu cuenta',
    description: 'Si olvidaste tu contraseña, solicita un enlace de recuperación. El registro de cuentas nuevas está temporalmente pausado.',
    links: [
      { to: '/recuperar-acceso', label: 'Recuperar contraseña' },
      { to: '/crear-cuenta', label: 'Crear una cuenta' },
    ],
  },
  {
    id: 'reportar',
    icon: ShieldCheck,
    title: 'Reportar contenido',
    description: 'Los reportes de equipos y valoraciones se envían desde la ficha o la valoración correspondiente. Consulta las normas de la comunidad.',
    links: [{ to: '/normas#reportar', label: 'Cómo reportar una irregularidad' }],
  },
  {
    id: 'privacidad',
    icon: FileText,
    title: 'Privacidad y datos',
    description: 'Consulta qué información utiliza Rentia y qué derechos puedes ejercer sobre tus datos.',
    links: [{ to: '/privacidad#solicitudes', label: 'Información sobre solicitudes de datos' }],
  },
];

export default function AyudaPage() {
  return (
    <PaginaCuenta rol={null} ancho="estrecho" fondo="background">
      <PageHeader
        breadcrumb="Inicio / Centro de ayuda"
        eyebrow="Orientación para la comunidad"
        titulo="¿Cómo podemos ayudarte?"
        subtitulo="Encuentra los pasos disponibles para acceder a tu cuenta, reportar contenido y consultar información de privacidad."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {helpTopics.map(({ id, icon: Icon, title, description, links }) => (
          <Card key={id} className="flex flex-col">
            <span className="flex size-11 items-center justify-center rounded-xl bg-surface-muted text-primary">
              <Icon size={20} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-heading-md font-semibold text-text">{title}</h2>
            <p className="mt-2 flex-1 text-body leading-relaxed text-text-muted">{description}</p>
            <div className="mt-4 flex flex-col items-start gap-2">
              {links.map(({ to, label }) => (
                <Link key={to} to={to} className="inline-flex min-h-11 items-center gap-2 text-label font-semibold text-primary">
                  {label} <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </Card>
        ))}

      </div>

      <p className="mt-6 flex items-start gap-2 text-small text-text-muted">
        <CircleHelp size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
        Las opciones de esta página enlazan a funciones o información disponibles en Rentia. No hay un canal de contacto externo configurado en la aplicación.
      </p>
    </PaginaCuenta>
  );
}
