// Logic/categorias.js

// ========== CATEGORÍAS DE INGRESOS ==========
export const CATEGORIAS_INGRESOS = [
  {
    id: 'salario',
    nombre: 'Salario',
    icono: '💼',
    color: '#2ecc71'
  },
  {
    id: 'inversiones',
    nombre: 'Inversiones',
    icono: '📈',
    color: '#9b59b6'
  },
  {
    id: 'regalo',
    nombre: 'Regalo',
    icono: '🎁',
    color: '#e74c3c'
  },
  {
    id: 'venta',
    nombre: 'Venta',
    icono: '🛍️',
    color: '#f39c12'
  },
  {
    id: 'reembolso',
    nombre: 'Reembolso',
    icono: '💳',
    color: '#1abc9c'
  },
  {
    id: 'otro_ingreso',
    nombre: 'Otro Ingreso',
    icono: '💰',
    color: '#95a5a6'
  }
];

// ========== CATEGORÍAS DE GASTOS ==========
export const CATEGORIAS_GASTOS = [
  {
    id: 'comida',
    nombre: 'Comida',
    icono: '🍔',
    color: '#e67e22'
  },
  {
    id: 'transporte',
    nombre: 'Transporte',
    icono: '🚗',
    color: '#3498db'
  },
  {
    id: 'vivienda',
    nombre: 'Vivienda',
    icono: '🏠',
    color: '#27ae60'
  },
  {
    id: 'servicios',
    nombre: 'Servicios',
    icono: '💡',
    color: '#f1c40f'
  },
  {
    id: 'entretenimiento',
    nombre: 'Entretenimiento',
    icono: '🎮',
    color: '#8e44ad'
  },
  {
    id: 'salud',
    nombre: 'Salud',
    icono: '🏥',
    color: '#c0392b'
  },
  {
    id: 'educacion',
    nombre: 'Educación',
    icono: '📚',
    color: '#2980b9'
  },
  {
    id: 'ropa',
    nombre: 'Ropa',
    icono: '👕',
    color: '#d35400'
  },
  {
    id: 'suscripciones',
    nombre: 'Suscripciones',
    icono: '📱',
    color: '#7f8c8d'
  },
  {
    id: 'mascotas',
    nombre: 'Mascotas',
    icono: '🐾',
    color: '#16a085'
  },
  {
    id: 'viajes',
    nombre: 'Viajes',
    icono: '✈️',
    color: '#e84393'
  },
  {
    id: 'otro_gasto',
    nombre: 'Otro Gasto',
    icono: '💸',
    color: '#95a5a6'
  }
];

// ========== FUNCIONES AUXILIARES ==========
export const getCategoriaPorId = (id, tipo) => {
  const categorias = tipo === 'ingreso' ? CATEGORIAS_INGRESOS : CATEGORIAS_GASTOS;
  return categorias.find(cat => cat.id === id) || categorias[categorias.length - 1];
};

export const getCategoriasPorTipo = (tipo) => {
  return tipo === 'ingreso' ? CATEGORIAS_INGRESOS : CATEGORIAS_GASTOS;
};