"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/session-context";

const LINKS = [
  { href: "/", label: "Biblioteca" },
  { href: "/salon-de-la-fama", label: "Salón de la Fama" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav id="navbar">
        <Link href="/" className="brand">
          <span className="neon-cyan">ARCADE</span>
          <span className="neon-magenta"> VAULT</span>
        </Link>

        <div className="nav-links">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(pathname, link.href) ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ width: 1, height: 22, background: "rgba(0,245,255,.25)" }} />

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div style={{ fontSize: 12, letterSpacing: 1 }}>{user.name}</div>
              <button type="button" className="nav-link" style={{ fontSize: 11 }} onClick={logout}>
                Salir
              </button>
            </div>
          ) : (
            <Link href="/auth" className="btn btn-primary">
              INICIAR SESIÓN
            </Link>
          )}
        </div>

        <button
          type="button"
          className="burger"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div id="mobile-menu">
        {menuOpen ? (
          <div className="drawer">
            <div className="close" onClick={closeMenu}>
              X
            </div>
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="item" onClick={closeMenu}>
                {link.label.toUpperCase()}
              </Link>
            ))}
            <Link
              href="/auth"
              className="btn btn-primary"
              style={{ marginTop: "auto" }}
              onClick={closeMenu}
            >
              MI CUENTA
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
