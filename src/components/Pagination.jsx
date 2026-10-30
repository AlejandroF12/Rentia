import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination() {
  const base = 'flex size-9 items-center justify-center rounded-lg text-label text-text-muted';
  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2">
      <button type="button" aria-label="Página anterior" className={base}><ChevronLeft size={16} /></button>
      <button type="button" aria-current="page" className={`${base} bg-primary font-semibold text-primary-foreground`}>1</button>
      <button type="button" className={base}>2</button>
      <button type="button" className={base}>3</button>
      <button type="button" aria-label="Página siguiente" className={base}><ChevronRight size={16} /></button>
    </nav>
  );
}
