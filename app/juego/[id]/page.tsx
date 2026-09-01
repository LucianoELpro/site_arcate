import Link from "next/link";
import { getGameById } from "@/lib/games";
import { formatScore, getTopScores } from "@/lib/scores";

export default async function GameDetailPage({ params }: PageProps<"/juego/[id]">) {
  const { id } = await params;
  const game = getGameById(id);
  const scores = getTopScores(game.id, 10);

  return (
    <section className="screen wrap">
      <Link href="/" className="btn btn-ghost" style={{ marginBottom: 28 }}>
        ◄ VOLVER AL VAULT
      </Link>

      <div className="detail">
        <div>
          <div className="detail-cover" style={{ background: game.grad }}>
            <div className="cover-label">[ ARTE DE PORTADA ]</div>
          </div>
          <h1
            className="pixel neon-yellow"
            style={{ margin: 0, fontSize: "clamp(20px,4vw,34px)", lineHeight: 1.4 }}
          >
            {game.title}
          </h1>
          <div className="tags">
            <div className="tag">{game.category}</div>
            <div className="tag m">{game.year}</div>
            <div className="tag y">1 JUGADOR</div>
          </div>
          <p className="lead">{game.long}</p>
          <div className="actions">
            <Link href={`/jugar/${game.id}`} className="btn btn-cta">
              JUGAR AHORA
            </Link>
            <Link
              href="/"
              className="btn btn-outline"
              style={{ padding: "19px 30px", fontSize: 13 }}
            >
              VOLVER AL VAULT
            </Link>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">MEJORES PUNTUACIONES</div>
          {scores.map((entry, index) => {
            const medal = ["g1", "g2", "g3"][index] ?? "";
            return (
              <div
                key={`${entry.player}-${index}`}
                className="mini-row"
                style={{ animationDelay: `${index * 55}ms` }}
              >
                <div className={`rank ${medal}`}>{String(index + 1).padStart(2, "0")}</div>
                <div className="player-name">{entry.player}</div>
                <div style={{ textAlign: "right" }}>
                  <div className={`score-cell ${medal}`}>{formatScore(entry.score)}</div>
                  <div className="date-cell" style={{ marginTop: 4 }}>
                    {entry.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
