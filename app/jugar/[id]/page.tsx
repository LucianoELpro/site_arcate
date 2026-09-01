"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getGameById } from "@/lib/games";
import { formatScore } from "@/lib/scores";
import { useSession } from "@/lib/session-context";

const SCORE = 0;
const LIVES = 3;
const LEVEL = 1;

export default function PlayerPage() {
  const params = useParams<{ id: string }>();
  const game = getGameById(params.id);
  const { user } = useSession();
  const [paused, setPaused] = useState(false);

  return (
    <section className="screen wrap wrap-narrow" style={{ paddingTop: 34 }}>
      <div className="hud">
        <div className="hud-stats">
          <div>
            <div className="label">PUNTUACIÓN</div>
            <div className="hud-val neon-cyan">{formatScore(SCORE)}</div>
          </div>
          <div>
            <div className="label">VIDAS</div>
            <div className="hud-val neon-magenta">{"♥".repeat(LIVES)}</div>
          </div>
          <div>
            <div className="label">NIVEL</div>
            <div className="hud-val neon-yellow">{String(LEVEL).padStart(2, "0")}</div>
          </div>
          <div>
            <div className="label">JUGADOR</div>
            <div style={{ fontSize: 14, letterSpacing: 1, marginTop: 9 }}>
              {user ? user.name : "INVITADO"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="btn btn-yellow" onClick={() => setPaused((p) => !p)}>
            {paused ? "SEGUIR" : "PAUSA"}
          </button>
          <Link href="/" className="btn btn-magenta">
            SALIR
          </Link>
        </div>
      </div>

      <div className="bezel">
        <div className="screen-inner">
          <div className="cartridge">
            <div>
              <div className="spinner" />
              <div
                className="pixel"
                style={{ fontSize: 11, color: "var(--cyan)", lineHeight: 1.9 }}
              >
                CARGANDO CARTUCHO
              </div>
              <p className="muted" style={{ margin: "18px auto 0", maxWidth: "44ch", lineHeight: 1.8 }}>
                Este contenedor es un iframe aislado: aquí se monta el archivo HTML del juego
                externo. Llama a AV.Player.loadCartridge(ruta) con la ruta del cartucho.
              </p>
            </div>
          </div>
        </div>
        <div className="controls-bar">
          <div>{game.controls}</div>
          <div>ESPACIO · PAUSA</div>
        </div>
      </div>

      {paused ? (
        <div className="pause-back">
          <div className="pause-text">PAUSA</div>
        </div>
      ) : null}
    </section>
  );
}
