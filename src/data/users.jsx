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
    email: 'maria.lopez@correo.com',
    password: 'cliente123',
    home: '/cliente',
  },
  arrendador: {
    role: 'arrendador',
    label: 'Arrendador',
    name: 'Carlos Rojas',
    initials: 'CR',
    detail: 'Arrendador · Yopal, Casanare',
    email: 'carlos.rojas@correo.com',
    password: 'arrendador123',
    home: '/arrendador/equipos',
  },
  admin: {
    role: 'admin',
    label: 'Administración',
    name: 'Andrea Pérez',
    initials: 'AP',
    detail: 'Administración / Moderación',
    email: 'andrea.perez@rentia.com',
    password: 'admin123',
    home: '/menu-administracion',
  },
};

export const getUser = (role = 'public') => users[role] ?? users.public;

export const demoUsers = Object.values(users).filter((user) => user.email);

export const findDemoUser = (email, password) =>
  demoUsers.find((user) => user.email === email && user.password === password);
