"use client";

// Sesión simulada, sin backend real. Persiste en localStorage para
// sobrevivir a un refresh (ver specs/01-mvp-visual-pantallas.md).
// Se sincroniza con localStorage vía useSyncExternalStore en lugar de
// useEffect+setState, para evitar problemas de hidratación SSR/cliente.

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "arcadeVault.session.v1";

export type SessionUser = {
  name: string;
  guest: boolean;
};

type Listener = () => void;
const listeners = new Set<Listener>();

let cachedRaw: string | null = null;
let cachedUser: SessionUser | null = null;

function readUser(): SessionUser | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedUser;
  cachedRaw = raw;
  if (!raw) {
    cachedUser = null;
    return cachedUser;
  }
  try {
    cachedUser = JSON.parse(raw) as SessionUser;
  } catch {
    cachedUser = null;
  }
  return cachedUser;
}

function getServerSnapshot(): SessionUser | null {
  return null;
}

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  window.addEventListener("storage", emitChange);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", emitChange);
  };
}

function writeUser(next: SessionUser | null) {
  if (next) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  emitChange();
}

type SessionContextValue = {
  user: SessionUser | null;
  login: (name: string) => void;
  loginGuest: () => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, readUser, getServerSnapshot);

  const login = useCallback(
    (name: string) => writeUser({ name, guest: false }),
    [],
  );

  const loginGuest = useCallback(() => writeUser({ name: "INVITADO", guest: true }), []);

  const logout = useCallback(() => writeUser(null), []);

  return (
    <SessionContext.Provider value={{ user, login, loginGuest, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession debe usarse dentro de <SessionProvider>");
  }
  return ctx;
}
