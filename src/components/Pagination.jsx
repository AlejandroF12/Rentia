import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const base = 'flex size-11 items-center justify-center rounded-lg text-label text-text-muted hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40 sm:size-9';
  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Página anterior"
        className={base}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`Página ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`${base} ${page === currentPage ? 'bg-primary font-semibold text-primary-foreground' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="Página siguiente"
        className={base}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
