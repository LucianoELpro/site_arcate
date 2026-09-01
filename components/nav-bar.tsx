"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/session-context";

// Navbar global portado de references/home-about/home-about/nav.jsx.
// Usa el tema de la landing (.av-nav), por eso todo va envuelto en `.home-av`
// (ver app/home-arcade.css). Aparece en / y en /juegos.
//
// Destinos: se apunta a las rutas reales ya construidas por los specs 01–03.
type NavLink = {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
};

const LINKS: NavLink[] = [
  { href: "/", label: "Inicio", match: (p) => p === "/" },
  {
    href: "/juegos",
    label: "Biblioteca",
    match: (p) => p.startsWith("/juego") || p.startsWith("/jugar"),
  },
  {
    href: "/salon-de-la-fama",
    label: "Salón de la Fama",
    match: (p) => p.startsWith("/salon-de-la-fama"),
  },
  {
    href: "/sobre-nosotros",
    label: "Acerca de",
    match: (p) => p.startsWith("/sobre-nosotros"),
  },
];

export function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="home-av">
      <nav className="av-nav">
        <Link href="/" className="logo">
          <span className="logo-mark" />
          <span className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </span>
        </Link>

        <div className="links">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={link.match(pathname) ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="spacer" />

        <div className="coin-counter">
          <span className="coin" />
          <span>CRÉDITOS · 03</span>
        </div>

        {user ? (
          <button type="button" className="btn ghost auth-btn" onClick={logout}>
            {user.name} ▾
          </button>
        ) : (
          <Link href="/auth" className="btn auth-btn">
            Iniciar Sesión
          </Link>
        )}

        <button
          type="button"
          className="btn ghost hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Menú"
        >
          ≡
        </button>
      </nav>

      <div
        className={`av-mobile-backdrop${menuOpen ? " open" : ""}`}
        onClick={closeMenu}
      />
      <aside className={`av-mobile-panel${menuOpen ? " open" : ""}`}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>
          MENÚ
        </div>
        {LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={link.match(pathname) ? "active" : ""}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/auth"
          className={pathname.startsWith("/auth") ? "active" : ""}
          onClick={closeMenu}
        >
          {user ? "Cuenta" : "Iniciar Sesión"}
        </Link>
        <div style={{ flex: 1 }} />
        <div
          className="pixel"
          style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}
        >
          CRÉDITOS · 03
        </div>
      </aside>
    </div>
  );
}
