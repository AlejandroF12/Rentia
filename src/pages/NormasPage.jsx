import PaginaLegal from '../components/PaginaLegal';
import { normas } from '../data/legales';

export default function NormasPage() {
  return <PaginaLegal contenido={normas} />;
}
