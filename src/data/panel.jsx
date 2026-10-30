/** Datos de ejemplo de las áreas de arrendador y cliente (sustituir por datos reales). */

export const resumenArrendador = { equipos: '03', publicados: '02', valoracion: '4,9' };

export const misEquipos = [
  { id: 1, nombre: 'Retroexcavadora CAT 420F', lugar: 'Yopal, Casanare', actualizado: 'Actualizado hoy', publicada: true, disponible: true, textoDisponibilidad: 'Disponible' },
  { id: 2, nombre: 'Volqueta doble troque', lugar: 'Tauramena, Casanare', actualizado: 'Actualizado el 16 oct.', publicada: true, disponible: false, textoDisponibilidad: 'No disponible' },
  { id: 3, nombre: 'Excavadora Komatsu PC200', lugar: 'Aguazul, Casanare', actualizado: 'Actualizado el 16 oct.', publicada: false, disponible: false, textoDisponibilidad: 'Sin publicar' },
];

/** Formularios de vehículo (agregar / editar / revisión) */
export const equipoKomatsu = {
  nombre: 'Excavadora Komatsu PC200',
  categoria: 'Movimiento de tierra',
  marca: 'Komatsu · PC200',
  anio: '2020',
  caracteristica: '148 HP · Peso 20 toneladas',
  descripcion: 'Excavadora sobre orugas para movimiento de tierra y adecuación de terrenos. Equipo en buen estado, ubicado en Aguazul. Consulta directamente la operación y el traslado.',
  municipio: 'Aguazul, Casanare',
  municipioCorto: 'Aguazul',
  sector: 'Sector rural de Aguazul',
  fotos: 2,
  disponible: true,
  celular: '+57 310 456 7820',
};

export const equipoCat = {
  nombre: 'Retroexcavadora CAT 420F',
  categoria: 'Movimiento de tierra',
  marca: 'Caterpillar · 420F',
  anio: '2018',
  caracteristica: '93 HP · Tracción 4 × 4',
  descripcion: 'Retroexcavadora en excelente estado para excavación, movimiento de tierra y adecuación de terrenos. Disponible en Yopal y municipios cercanos. Consulta las condiciones de operación y traslado.',
  municipio: 'Yopal, Casanare',
  municipioCorto: 'Yopal',
  sector: 'El Morro',
  fotos: 2,
  disponible: true,
  celular: '+57 310 456 7820',
};

export const categoriasEquipo = ['Movimiento de tierra', 'Transporte de carga', 'Agrícola', 'Elevación y apoyo'];
export const municipios = ['Yopal, Casanare', 'Aguazul, Casanare', 'Tauramena, Casanare', 'Villanueva, Casanare'];

/** Cliente */
export const clienteMuestra = {
  nombre: 'María López',
  nombrePila: 'María',
  detalle: 'Cliente · Yopal, Casanare',
  correo: 'maria.lopez@correo.com',
  celular: '+57 312 589 2041',
  desde: 'Septiembre de 2025',
  favoritos: '02',
  enviadas: '01',
  recibidas: '03',
};

export const reputacionCliente = {
  puntaje: '5,0',
  total: '3 valoraciones de arrendadores',
  cita: '“María fue clara y muy respetuosa en la comunicación.”',
  autor: 'Carlos Rojas · 13 oct. 2026',
};

export const valoracionEnviada = {
  titulo: 'Calificaste a Carlos Rojas · Arrendador',
  meta: 'CAT 420F · Yopal · 12 oct. 2026',
  texto: 'Carlos respondió con claridad y el equipo estaba en muy buenas condiciones. Excelente atención para nuestro proyecto.',
};

/** Formularios de valoración */
export const valoracionCliente = {
  eyebrow: 'Cliente → Arrendador',
  titulo: 'Tu experiencia orienta a otros.',
  volver: 'Volver a mis valoraciones',
  calificado: { nombre: 'Carlos Rojas', detalle: 'Arrendador · Yopal, Casanare' },
  pregunta: '¿Cómo fue la atención de Carlos?',
  chips: ['Buena atención', 'Información clara', 'Estado del equipo'],
  comentario: 'Carlos respondió con claridad y el equipo estaba en muy buenas condiciones. Excelente atención para nuestro proyecto en Yopal.',
  contador: '145',
  declaracion: 'Declaro que tuve contacto directo previo con Carlos. Mi valoración describe esa experiencia.',
  publicadoComo: 'Se publicará como María López · Cliente.',
};

export const valoracionArrendador = {
  eyebrow: 'Arrendador → Cliente',
  titulo: 'Las buenas relaciones se reconocen.',
  volver: 'Volver a mis valoraciones',
  calificado: { nombre: 'María López', detalle: 'Cliente · Yopal, Casanare' },
  pregunta: '¿Cómo fue el contacto con María?',
  chips: ['Comunicación clara', 'Respeto', 'Seriedad'],
  comentario: 'María fue clara y muy respetuosa en la comunicación. Explicó bien lo que necesitaba para su proyecto en Yopal.',
  contador: '129',
  declaracion: 'Declaro que tuve contacto directo previo con María. Mi valoración describe esa experiencia.',
  publicadoComo: 'Se publicará como Carlos Rojas · Arrendador.',
};

export const contactoCompartido = {
  nombre: 'Retroexcavadora CAT 420F',
  detalle: 'Yopal · Contacto del 12 oct. 2026',
};
