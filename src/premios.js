// Configuración y lógica de premios de la ruleta.
// Todo el estado se guarda en localStorage para sobrevivir a recargas de la página.
//
// Un "tiro" es un participante: puede girar varias veces ("tirá de nuevo" / "otra
// oportunidad"), pero su turno termina con un premio o con "gracias por participar".

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

// Apenas un poco más de chance para gorras, cuadernos y vasos: salen algo más seguido
// al principio, pero igual se reparten a lo largo de todo el evento.
export const PRIORIDAD = { gorra: 1.25, cuaderno: 1.25, vaso: 1.25 };

// Participantes estimados para todo el evento (se ajusta desde el menú oculto).
export const PARTICIPANTES_DEFAULT = 700;

// Tiro (número de participante) en el que sale la gorra firmada.
export const TIRO_FIRMADA_DEFAULT = 43;

// Probabilidad de que un giro caiga en "TIRÁ DE NUEVO" / "OTRA OPORTUNIDAD"
// según cuántas veces ya volvió a girar la misma persona. El último giro siempre
// define el turno: premio o "gracias por participar".
export const PROB_REPETIR = [0.55, 0.35, 0];

const CLAVE = "ruletaML.estado.v1";

export const stockInicial = () =>
  Object.fromEntries(PREMIOS.map((p) => [p.id, p.cantidad]));

export const estadoInicial = () => ({
  tiros: 0, // participantes que ya jugaron = número de tiro actual
  entregados: 0, // premios entregados
  giros: 0, // giros totales, incluidos los "tirá de nuevo"
  stock: stockInicial(),
  tiroFirmada: TIRO_FIRMADA_DEFAULT,
  participantes: PARTICIPANTES_DEFAULT,
  historial: [], // [{ n: tiro, id: premio o null, t }]
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
      // Versiones anteriores: todos ganaban, así que tiros = premios entregados.
      tiros: guardado.tiros ?? guardado.entregados ?? 0,
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

export const nombrePremio = (id) => {
  const p = premioPorId(id);
  return p ? `${p.titulo} ${p.detalle}`.trim() : "Sin premio";
};

export const totalRestante = (estado) =>
  Object.values(estado.stock).reduce((a, b) => a + b, 0);

const stockComun = (estado) =>
  PREMIOS.reduce((a, p) => (p.id === "firmada" ? a : a + estado.stock[p.id]), 0);

// Participantes que faltan jugar (contando el próximo), sin el tiro reservado a la firmada.
function participantesRestantes(estado) {
  const proximo = estado.tiros + 1;
  let faltan = estado.participantes - estado.tiros;
  if (estado.stock.firmada > 0 && estado.tiroFirmada > proximo && estado.tiroFirmada <= estado.participantes) {
    faltan -= 1;
  }
  return faltan;
}

// Chance de que el próximo participante (que no sea el de la firmada) se lleve algo.
// Es premios restantes / participantes restantes: así el stock rinde justo para todo
// el evento. Si vienen más personas que las estimadas, se entrega lo que quede.
export function probabilidadPremio(estado) {
  const stock = stockComun(estado);
  if (stock === 0) return 0;
  const faltan = participantesRestantes(estado);
  return faltan <= stock ? 1 : stock / faltan;
}

// Elige el resultado del turno: id del premio, o null si es "gracias por participar".
export function elegirPremio(estado, azar = Math.random) {
  const proximo = estado.tiros + 1;
  if (estado.stock.firmada > 0 && proximo >= estado.tiroFirmada) return "firmada";

  if (azar() >= probabilidadPremio(estado)) return null;

  const pool = PREMIOS.filter((p) => p.id !== "firmada" && estado.stock[p.id] > 0);
  const peso = (p) => estado.stock[p.id] * (PRIORIDAD[p.id] || 1);
  const total = pool.reduce((a, p) => a + peso(p), 0);
  if (total === 0) return null;

  let r = azar() * total;
  for (const p of pool) {
    r -= peso(p);
    if (r < 0) return p.id;
  }
  return pool[pool.length - 1].id;
}

// Cierra el turno del participante, con premio (id) o sin premio (null).
export function registrarTiro(estado, id) {
  const n = estado.tiros + 1;
  return {
    ...estado,
    tiros: n,
    entregados: id ? estado.entregados + 1 : estado.entregados,
    stock: id ? { ...estado.stock, [id]: estado.stock[id] - 1 } : estado.stock,
    historial: [...estado.historial, { n, id: id || null, t: Date.now() }],
  };
}

export function deshacerUltimo(estado) {
  const ultimo = estado.historial[estado.historial.length - 1];
  if (!ultimo) return estado;
  return {
    ...estado,
    tiros: Math.max(0, estado.tiros - 1),
    entregados: ultimo.id ? Math.max(0, estado.entregados - 1) : estado.entregados,
    stock: ultimo.id ? { ...estado.stock, [ultimo.id]: estado.stock[ultimo.id] + 1 } : estado.stock,
    historial: estado.historial.slice(0, -1),
  };
}

export const reiniciarContador = (estado) => ({
  ...estado,
  tiros: 0,
  entregados: 0,
  giros: 0,
  historial: [],
});

export const reiniciarTodo = (estado) => ({
  ...estadoInicial(),
  tiroFirmada: estado.tiroFirmada,
  participantes: estado.participantes,
});
