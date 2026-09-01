"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useSession } from "@/lib/session-context";

type AuthTab = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const { login, loginGuest } = useSession();
  const [tab, setTab] = useState<AuthTab>("login");
  const [username, setUsername] = useState("");

  const isRegister = tab === "register";

  const handleLogin = () => {
    login((username.trim() || "JUGADOR_01").toUpperCase());
    router.push("/");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleLogin();
  };

  const handleGuest = () => {
    loginGuest();
    router.push("/");
  };

  return (
    <section className="screen auth-wrap">
      <div className="auth-card">
        <div className="pixel" style={{ textAlign: "center", fontSize: 15, marginBottom: 30 }}>
          <span className="neon-cyan">ARCADE</span>
          <span className="neon-magenta"> VAULT</span>
        </div>

        <div className="tabs">
          <div
            className={`tab ${isRegister ? "" : "active"}`}
            onClick={() => setTab("login")}
          >
            INICIAR SESIÓN
          </div>
          <div
            className={`tab ${isRegister ? "active" : ""}`}
            onClick={() => setTab("register")}
          >
            CREAR CUENTA
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <div className="field-label">USUARIO</div>
            <input
              className="input"
              placeholder="jugador_01"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          {isRegister ? (
            <label className="field">
              <div className="field-label">CORREO ELECTRÓNICO</div>
              <input className="input" type="email" placeholder="tu@correo.com" />
            </label>
          ) : null}

          <label className="field">
            <div className="field-label">CONTRASEÑA</div>
            <input className="input" type="password" placeholder="••••••••" />
          </label>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: 17, fontSize: 11 }}
          >
            {isRegister ? "CREAR CUENTA" : "ENTRAR"}
          </button>
        </form>

        <div className="divider">
          <span />
          <em>O CONTINÚA CON</em>
          <span />
        </div>

        <div className="social">
          <div onClick={handleLogin}>Google</div>
          <div onClick={handleLogin}>GitHub</div>
        </div>

        <div className="guest" onClick={handleGuest}>
          JUGAR COMO INVITADO
        </div>

        <p className="fineprint">
          Sin cuenta, las puntuaciones no se guardan en el servidor. Aquí conectaría la API de
          autenticación (REST o Supabase).
        </p>
      </div>
    </section>
  );
}
