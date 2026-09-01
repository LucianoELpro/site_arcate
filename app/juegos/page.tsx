"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, GAMES, HERO_GIF } from "@/lib/games";
import { getBestScore } from "@/lib/scores";

export default function Juegos() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);

  const games = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GAMES.filter((game) => {
      const okCat = category === "TODOS" || game.category === category;
      const okQuery =
        !q || `${game.title} ${game.blurb} ${game.category}`.toLowerCase().includes(q);
      return okCat && okQuery;
    });
  }, [query, category]);

  return (
    <section className="screen wrap">
      <div className="hero">
        <div className="hero-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-gif" src={HERO_GIF} alt="" />
          <h1 className="title">ARCADE VAULT</h1>
        </div>
        <p className="subtitle">INSERTA UNA MONEDA PARA JUGAR</p>
        <p className="muted" style={{ margin: "16px 0 0" }}>
          {GAMES.length} cartuchos en la bóveda · puntuaciones guardadas en este navegador
        </p>
      </div>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Buscar un juego por nombre..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {games.length ? (
        <div className="grid">
          {games.map((game) => (
            <article className="card" key={game.id}>
              <div className="cover" style={{ background: game.grad }}>
                <div className="cover-label">[ PORTADA · {game.slug} ]</div>
                <div className="cover-cat">{game.category}</div>
              </div>
              <div className="card-body">
                <h3 className="card-title">{game.title}</h3>
                <p className="card-blurb">{game.blurb}</p>
                <div className="card-foot">
                  <div>
                    <div className="label">MEJOR PUNTUACIÓN</div>
                    <div className="best">{getBestScore(game.id)}</div>
                  </div>
                  <Link href={`/juego/${game.id}`} className="btn btn-outline">
                    JUGAR
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="pixel" style={{ fontSize: 14, color: "var(--magenta)" }}>
            SIN RESULTADOS
          </div>
          <p className="muted" style={{ marginTop: 16 }}>
            Ningún cartucho coincide con esa búsqueda.
          </p>
        </div>
      )}
    </section>
  );
}
