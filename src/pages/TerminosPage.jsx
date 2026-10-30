import PaginaLegal from '../components/PaginaLegal';
import { terminos } from '../data/legales';

export default function TerminosPage() {
  return <PaginaLegal contenido={terminos} />;
}
