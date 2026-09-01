// Catálogo de cartuchos. Títulos originales (no marcas registradas).
// Puerto 1:1 de references/js/data.js.

export type Game = {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  playable: boolean;
  blurb: string;
  long: string;
  controls: string;
  grad: string;
};

export const GAMES: Game[] = [
  {
    id: "serpiente",
    title: "NEÓN SERPIENTE",
    slug: "SERPIENTE",
    category: "CLÁSICOS",
    year: "1978",
    playable: true,
    blurb: "Crece sin morder tu propia cola.",
    long: "Guías una línea de luz que no deja de crecer por una rejilla cerrada. Cada fruta que devoras alarga el cuerpo y acelera el ritmo. El único enemigo es tu propio rastro, y los muros no perdonan.",
    controls: "FLECHAS / WASD · MOVER",
    grad: "linear-gradient(135deg,#00f5ff,#0066a8)",
  },
  {
    id: "bloques",
    title: "BLOQUES CAÍDOS",
    slug: "BLOQUES",
    category: "PUZZLE",
    year: "1984",
    playable: false,
    blurb: "Encaja las piezas antes de que la pila suba.",
    long: "Siete figuras caen sin descanso desde el techo del pozo. Rótalas y encájalas para completar líneas limpias antes de que la pila alcance el borde superior. Cada nivel las suelta más rápido.",
    controls: "FLECHAS · ROTAR Y CAER",
    grad: "linear-gradient(135deg,#ff006e,#5a0030)",
  },
  {
    id: "invasores",
    title: "INVASORES",
    slug: "INVASORES",
    category: "DISPAROS",
    year: "1980",
    playable: false,
    blurb: "Defiende la base de las oleadas del cielo.",
    long: "Formaciones enemigas descienden fila por fila mientras tu cañón se desliza tras cuatro búnkeres que se deshacen a cada impacto. Vacía la pantalla antes de que toquen el suelo.",
    controls: "FLECHAS · MOVER · ESPACIO · DISPARAR",
    grad: "linear-gradient(135deg,#f5ff00,#8a7a00)",
  },
  {
    id: "asteroides",
    title: "ASTEROIDES",
    slug: "ASTEROIDES",
    category: "DISPAROS",
    year: "1981",
    playable: false,
    blurb: "Pulveriza rocas a la deriva en gravedad cero.",
    long: "Tu nave gira sobre su eje en el vacío, sin freno y con inercia real. Cada roca que revientas se parte en fragmentos más rápidos y pequeños. Sobrevive al campo entero para pasar de oleada.",
    controls: "FLECHAS · GIRAR · ESPACIO · DISPARAR",
    grad: "linear-gradient(135deg,#7b5cff,#1b1046)",
  },
  {
    id: "paleta",
    title: "PALETA Y MURO",
    slug: "PALETA",
    category: "CLÁSICOS",
    year: "1976",
    playable: false,
    blurb: "Rompe cada ladrillo con un solo rebote.",
    long: "Una paleta, una bola y un muro de ladrillos de colores. El ángulo de salida depende de dónde golpeas, así que cada rebote es una decisión. Las filas superiores valen más y devuelven la bola más rápido.",
    controls: "FLECHAS · MOVER LA PALETA",
    grad: "linear-gradient(135deg,#00ffa3,#00553a)",
  },
  {
    id: "laberinto",
    title: "LABERINTO VELOZ",
    slug: "LABERINTO",
    category: "LABERINTO",
    year: "1982",
    playable: false,
    blurb: "Devora puntos y esquiva a los guardianes.",
    long: "Recorre un laberinto sembrado de puntos con cuatro guardianes pisándote los talones. Las cápsulas de energía invierten la persecución durante unos segundos: el momento de cobrar deudas.",
    controls: "FLECHAS · MOVER",
    grad: "linear-gradient(135deg,#ff8a00,#5e2b00)",
  },
];

export const CATEGORIES = ["TODOS", "CLÁSICOS", "PUZZLE", "DISPAROS", "LABERINTO"];

export const HERO_GIF = "https://i.kym-cdn.com/photos/images/original/003/236/489/4b6.gif";

export function getGameById(id: string): Game {
  return GAMES.find((g) => g.id === id) ?? GAMES[0];
}
