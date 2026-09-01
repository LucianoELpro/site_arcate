// Datos mínimos para el preview "JUEGOS DISPONIBLES AHORA" del home.
// Portado del concepto de references/home-about/home-about/home.jsx (MiniCard).
//
// `cover` es la clase CSS de portada definida en app/home-arcade.css
// (`.cover-snake`, `.cover-tetro`, …), que dibuja el arte con CSS puro.
//
// Los `id` coinciden a propósito con lib/games.ts para que las mini-cards
// enlacen a las fichas reales en /juego/[id]. Cuando se unifique el catálogo,
// este módulo debería fusionarse con lib/games.ts (ver spec 02, "Modelo de datos").

export type HomeGame = {
  id: string;
  title: string;
  cat: string;
  cover: string;
};

export const HOME_GAMES: HomeGame[] = [
  { id: "serpiente", title: "NEÓN SERPIENTE", cat: "CLÁSICOS", cover: "cover-snake" },
  { id: "bloques", title: "BLOQUES CAÍDOS", cat: "PUZZLE", cover: "cover-tetro" },
  { id: "invasores", title: "INVASORES", cat: "DISPAROS", cover: "cover-invaders" },
  { id: "asteroides", title: "ASTEROIDES", cat: "DISPAROS", cover: "cover-rocas" },
  { id: "paleta", title: "PALETA Y MURO", cat: "CLÁSICOS", cover: "cover-bricks" },
  { id: "laberinto", title: "LABERINTO VELOZ", cat: "LABERINTO", cover: "cover-glot" },
];
