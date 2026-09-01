// Puntuaciones de solo lectura, sembradas de forma determinística por juego.
// Puerto 1:1 del algoritmo seedFor() de references/js/storage.js.
// No hay backend ni localStorage aquí: no se pueden agregar puntuaciones nuevas
// en este MVP (ver specs/01-mvp-visual-pantallas.md, fuera de alcance).

export type ScoreEntry = {
  player: string;
  score: number;
  date: string;
};

const SEED_NAMES = [
  "NEO", "PACO", "LUCIA", "R2D9", "SOFIA", "ZORRO",
  "MAXI", "IRIS", "TITO", "ELENA", "VIPER", "CHISPA",
];

function seedFor(id: string): ScoreEntry[] {
  let s = 0;
  for (let i = 0; i < id.length; i++) {
    s = (s * 31 + id.charCodeAt(i)) % 99991;
  }

  function rnd() {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  }

  const out: ScoreEntry[] = [];
  let v = 9000 + Math.floor(rnd() * 8000);
  for (let i = 0; i < 10; i++) {
    out.push({
      player:
        SEED_NAMES[Math.floor(rnd() * SEED_NAMES.length)] +
        (i % 3 === 0 ? "" : "_" + (10 + Math.floor(rnd() * 89))),
      score: v,
      date:
        "2026-0" +
        (1 + Math.floor(rnd() * 8)) +
        "-" +
        String(1 + Math.floor(rnd() * 28)).padStart(2, "0"),
    });
    v = Math.max(120, v - Math.floor(400 + rnd() * 1400));
  }
  return out;
}

export function getSeededScores(gameId: string): ScoreEntry[] {
  return seedFor(gameId).sort((a, b) => b.score - a.score);
}

export function getTopScores(gameId: string, n = 10): ScoreEntry[] {
  return getSeededScores(gameId).slice(0, n);
}

export function formatScore(n: number): string {
  return Number(n).toLocaleString("es-ES");
}

export function getBestScore(gameId: string): string {
  const top = getTopScores(gameId, 1);
  return top.length ? formatScore(top[0].score) : "—";
}
