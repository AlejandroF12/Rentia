export const users = {
  public: {
    role: 'public',
    label: 'Público',
    name: null,
  },
  cliente: {
    role: 'cliente',
    label: 'Cliente',
    name: 'María López',
    initials: 'ML',
    detail: 'Cliente · Yopal, Casanare',
  },
  arrendador: {
    role: 'arrendador',
    label: 'Arrendador',
    name: 'Carlos Rojas',
    initials: 'CR',
    detail: 'Arrendador · Yopal, Casanare',
  },
  admin: {
    role: 'admin',
    label: 'Administración',
    name: 'Andrea Pérez',
    initials: 'AP',
    detail: 'Administración / Moderación',
  },
};

export const getUser = (role = 'public') => users[role] ?? users.public;
