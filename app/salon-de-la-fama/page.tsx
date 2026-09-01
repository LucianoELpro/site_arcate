"use client";

import { useMemo, useState } from "react";
import { GAMES } from "@/lib/games";
import { formatScore, getTopScores } from "@/lib/scores";
import { useSession } from "@/lib/session-context";

export default function HallOfFamePage() {
  const { user } = useSession();
  const [hallId, setHallId] = useState(GAMES[0].id);

  const me = user && !user.guest ? user.name : null;
  const scores = useMemo(() => getTopScores(hallId, 10), [hallId]);

  return (
    <section className="screen wrap wrap-narrow">
      <div className="hero">
        <h1
          className="pixel neon-yellow"
          style={{ margin: 0, fontSize: "clamp(20px,4.6vw,40px)", lineHeight: 1.4 }}
        >
          SALÓN DE LA FAMA
        </h1>
        <p className="muted" style={{ margin: "18px 0 0" }}>
          Las diez mejores marcas de cada cartucho de la bóveda.
        </p>
      </div>

      <div className="tabs-row">
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            className={`chip ${hallId === game.id ? "active" : ""}`}
            onClick={() => setHallId(game.id)}
          >
            {game.slug}
          </button>
        ))}
      </div>

      <div className="panel">
        <div className="table-head">
          <div>RANGO</div>
          <div>JUGADOR</div>
          <div className="score-cell">PUNTUACIÓN</div>
          <div className="date-cell">FECHA</div>
        </div>

        {scores.map((entry, index) => {
          const medal = ["g1", "g2", "g3"][index] ?? "";
          const mine = me !== null && entry.player === me;
          const rowClass = mine ? "mine" : index < 3 ? "top3" : "";
          return (
            <div
              key={`${entry.player}-${index}`}
              className={`table-row ${rowClass}`}
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <div className={`rank ${medal}`}>{String(index + 1).padStart(2, "0")}</div>
              <div className="player-cell">
                <div className="player-name">{entry.player}</div>
                {mine ? <div className="mine-badge">TU MEJOR MARCA</div> : null}
              </div>
              <div className={`score-cell ${medal}`}>{formatScore(entry.score)}</div>
              <div className="date-cell">{entry.date}</div>
            </div>
          );
        })}
      </div>

      <p className="fineprint" style={{ textAlign: "left", marginTop: 22 }}>
        Datos leídos de localStorage. En producción, esta tabla se alimentaría del endpoint{" "}
        <span className="neon-cyan">GET /api/scores/:juego</span>.
      </p>
    </section>
  );
}
