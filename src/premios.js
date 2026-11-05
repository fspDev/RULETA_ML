// Configuración y lógica de premios de la ruleta.
// Todo el estado se guarda en localStorage para sobrevivir a recargas de la página.

export const PREMIOS = [
  { id: "firmada", cantidad: 1, titulo: "GORRA FIRMADA", detalle: "por Franco Colapinto" },
  { id: "gorra", cantidad: 60, titulo: "UNA GORRA", detalle: "" },
  { id: "cuaderno", cantidad: 60, titulo: "UN CUADERNO", detalle: "" },
  { id: "vaso", cantidad: 15, titulo: "UN VASO MP", detalle: "" },
  { id: "dd", cantidad: 10, titulo: "UN VOUCHER", detalle: "D&D" },
  { id: "bk", cantidad: 50, titulo: "UN VOUCHER", detalle: "Burger King" },
  { id: "mcd", cantidad: 50, titulo: "20% OFF", detalle: "en McDonald's" },
  { id: "mostaza", cantidad: 20, titulo: "UN VOUCHER", detalle: "Mostaza" },
  { id: "rapanui", cantidad: 50, titulo: "$4.500 DE REGALO", detalle: "en Rapanui" },
];

// Tiro (número de premio entregado) en el que sale la gorra firmada.
export const TIRO_FIRMADA_DEFAULT = 43;

// Probabilidad de que un giro caiga en "TIRÁ DE NUEVO" / "OTRA OPORTUNIDAD"
// según cuántas veces ya volvió a girar la misma persona. Al final siempre hay premio.
export const PROB_REPETIR = [0.55, 0.35, 0];

const CLAVE = "ruletaML.estado.v1";

export const stockInicial = () =>
  Object.fromEntries(PREMIOS.map((p) => [p.id, p.cantidad]));

export const estadoInicial = () => ({
  entregados: 0, // premios entregados = número de tiro actual
  giros: 0, // giros totales, incluidos los "tirá de nuevo"
  stock: stockInicial(),
  tiroFirmada: TIRO_FIRMADA_DEFAULT,
  historial: [], // [{ n, id, t }]
});

export function cargarEstado() {
  try {
    const raw = window.localStorage.getItem(CLAVE);
    if (!raw) return estadoInicial();
    const guardado = JSON.parse(raw);
    const base = estadoInicial();
    return {
      ...base,
      ...guardado,
      stock: { ...base.stock, ...(guardado.stock || {}) },
      historial: Array.isArray(guardado.historial) ? guardado.historial : [],
    };
  } catch {
    return estadoInicial();
  }
}

export function guardarEstado(estado) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // Sin almacenamiento disponible: la app sigue funcionando en memoria.
  }
}

export const premioPorId = (id) => PREMIOS.find((p) => p.id === id);

export const totalRestante = (estado) =>
  Object.values(estado.stock).reduce((a, b) => a + b, 0);

// Elige el premio del próximo tiro. La gorra firmada sale en su tiro;
// el resto se sortea ponderado por stock restante, así se reparten parejo
// durante el día y se terminan todos más o menos al mismo tiempo.
export function elegirPremio(estado) {
  const proximo = estado.entregados + 1;
  if (estado.stock.firmada > 0 && proximo >= estado.tiroFirmada) return "firmada";

  const pool = PREMIOS.filter((p) => p.id !== "firmada" && estado.stock[p.id] > 0);
  const total = pool.reduce((a, p) => a + estado.stock[p.id], 0);
  if (total === 0) return estado.stock.firmada > 0 ? "firmada" : null;

  let r = Math.random() * total;
  for (const p of pool) {
    r -= estado.stock[p.id];
    if (r < 0) return p.id;
  }
  return pool[pool.length - 1].id;
}

export function registrarPremio(estado, id) {
  const n = estado.entregados + 1;
  return {
    ...estado,
    entregados: n,
    stock: { ...estado.stock, [id]: estado.stock[id] - 1 },
    historial: [...estado.historial, { n, id, t: Date.now() }],
  };
}

export function deshacerUltimo(estado) {
  const ultimo = estado.historial[estado.historial.length - 1];
  if (!ultimo) return estado;
  return {
    ...estado,
    entregados: Math.max(0, estado.entregados - 1),
    stock: { ...estado.stock, [ultimo.id]: estado.stock[ultimo.id] + 1 },
    historial: estado.historial.slice(0, -1),
  };
}

export const reiniciarContador = (estado) => ({
  ...estado,
  entregados: 0,
  giros: 0,
  historial: [],
});

export const reiniciarTodo = (estado) => ({
  ...estadoInicial(),
  tiroFirmada: estado.tiroFirmada,
});
