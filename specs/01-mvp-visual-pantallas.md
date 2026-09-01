# 01 — MVP visual: todas las pantallas de Arcade Vault

- **Estado:** Approved
- **Fecha:** 2026-08-30
- **Depende de:** ninguno
- **Objetivo (una frase):** Implementar todas las pantallas de Arcade Vault (Biblioteca, Detalle, Jugador, Autenticación, Salón de la Fama) como rutas reales de Next.js reutilizando el tema visual ya existente, sin implementar ningún motor de juego real.

## Alcance

**Incluido:**

- Rutas reales de Next.js App Router:
  - `/` — Biblioteca (home)
  - `/juego/[id]` — Detalle del juego
  - `/jugar/[id]` — Pantalla Jugador
  - `/auth` — Autenticación (login / registro / invitado)
  - `/salon-de-la-fama` — Salón de la Fama
- Navbar sticky + menú móvil (drawer) funcionales y compartidos entre todas las rutas.
- Catálogo de los 6 juegos migrado a datos tipados (`lib/games.ts`), mismo contenido que `references/js/data.js`.
- Generador determinístico de puntuaciones sembradas (`lib/scores.ts`), puerto 1:1 de `seedFor()` en `references/js/storage.js`, usado en Detalle y Salón de la Fama en modo **solo lectura**.
- Buscador de texto + filtro por categoría funcional en la Biblioteca (filtra en el cliente, sin backend).
- Autenticación simulada: login, registro, "jugar como invitado" y "salir" cambian el estado de sesión sin backend real. La sesión persiste en `localStorage` (sobrevive a un refresh de página).
- Pantalla Jugador: HUD estático (puntuación 0, 3 vidas, nivel 01, nombre del usuario actual o "INVITADO"), bezel CRT que siempre muestra el estado "CARGANDO CARTUCHO" (spinner + texto), botón PAUSA/SEGUIR funcional con overlay "PAUSA", botón SALIR que vuelve a la Biblioteca.
- Hero GIF externo (`i.kym-cdn.com`) mantenido igual que la referencia, con un `<img>` plano.
- Se reutiliza el tema visual ya implementado (`app/globals.css`, fuentes Press Start 2P / Courier Prime) sin modificarlo.

**Explícitamente fuera de alcance:**

- Cualquier motor de juego real: canvas jugable, iframe de cartucho, lógica de Neón Serpiente u otro juego.
- El modal "Fin de juego" (`AV.GameOver`) y el flujo de "guardar puntuación": dependen de que exista una partida real, que no existe en este MVP.
- Backend real de autenticación o de puntuaciones (no hay API routes ni base de datos).
- Agregar puntuaciones nuevas al Salón de la Fama o al Detalle: quedan como solo lectura sobre datos sembrados.
- Accesibilidad avanzada, tests automatizados y metadata/SEO por página más allá del `<title>` global ya configurado.
- Internacionalización: todo el contenido permanece en español, igual que la referencia.

## Modelo de datos

- **`lib/games.ts`** — exporta:
  - `type Game = { id, title, slug, category, year, playable, blurb, long, controls, grad }`
  - `GAMES: Game[]` con los mismos 6 juegos de `references/js/data.js`
  - `CATEGORIES: string[]`
  - `getGameById(id: string): Game` (si el id no existe, devuelve `GAMES[0]`, igual que `AV.byId` en la referencia)

- **`lib/scores.ts`** — exporta:
  - `type ScoreEntry = { player: string, score: number, date: string }`
  - `getSeededScores(gameId: string): ScoreEntry[]` (puerto 1:1 del algoritmo `seedFor`)
  - `getTopScores(gameId: string, n?: number): ScoreEntry[]`
  - `getBestScore(gameId: string): string` (formateado, o `'—'` si no hay datos)

- **`lib/session-context.tsx`** (Client Component) — exporta:
  - `SessionProvider` (envuelve la app, persiste en `localStorage` bajo la key `arcadeVault.session.v1`)
  - `useSession()` → `{ user: { name: string, guest: boolean } | null, login(name: string): void, loginGuest(): void, logout(): void }`

No hay base de datos ni API routes en este spec.

## Plan de implementación

1. **Capa de datos**: crear `lib/games.ts` y `lib/scores.ts` portando el contenido y el algoritmo de `references/js/data.js` y `references/js/storage.js` (sin la función `push`, ya que las puntuaciones son de solo lectura).
2. **Sesión**: crear `lib/session-context.tsx` con `SessionProvider` sobre `localStorage`, y envolver `app/layout.tsx` con el provider sin romper el layout de tema ya existente (fuentes, capas de fondo).
3. **Navbar**: crear `components/nav-bar.tsx` (Client Component) que reemplace el navbar estático actual, usando `useSession()` y `usePathname()` para resaltar el link activo, e incluir el drawer móvil con estado local `menuOpen`.
4. **Página Biblioteca** (`app/page.tsx`): hero completo (con GIF), buscador + chips de categoría (estado local de React), grilla de tarjetas con `getBestScore` por juego, estado vacío "SIN RESULTADOS" cuando el filtro no encuentra nada.
5. **Página Detalle** (`app/juego/[id]/page.tsx`): portada, tags, descripción larga, tabla de mejores puntuaciones (`getTopScores`), botones "JUGAR AHORA" (→ `/jugar/[id]`) y "VOLVER AL VAULT" (→ `/`).
6. **Página Jugador** (`app/jugar/[id]/page.tsx`, Client Component): HUD estático, bezel con placeholder "CARGANDO CARTUCHO", botón PAUSA/SEGUIR (estado local) con overlay, botón SALIR (→ `/`).
7. **Página Auth** (`app/auth/page.tsx`, Client Component): tabs login/registro, inputs controlados, botones sociales simulados y "jugar como invitado", todos conectados a `useSession()`, redirigen a `/` al completarse.
8. **Página Salón de la Fama** (`app/salon-de-la-fama/page.tsx`): tabs por juego (chips), tabla de top-10 con medallas para los 3 primeros puestos, resaltado de la fila propia si el nombre del usuario logueado coincide con `player`.
9. **Revisión visual completa**: recorrer las 5 pantallas + navbar + drawer móvil en el navegador (`npm run dev`), comparar contra `references/index.html`, y confirmar que no queda ningún resto del boilerplate de `create-next-app`.

## Criterios de aceptación

- [ ] Las rutas `/`, `/juego/[id]`, `/jugar/[id]`, `/auth`, `/salon-de-la-fama` existen y compilan sin errores (`npm run build`).
- [ ] La Biblioteca muestra los 6 juegos de `lib/games.ts`; escribir en el buscador y hacer clic en una categoría filtran la grilla en vivo.
- [ ] Cada tarjeta de juego muestra su mejor puntuación (`getBestScore`) y su botón "JUGAR" navega a `/juego/[id]`.
- [ ] La página de Detalle muestra el top-10 de puntuaciones sembradas para ese juego y el botón "JUGAR AHORA" navega a `/jugar/[id]`.
- [ ] La página Jugador muestra el HUD (puntuación 0, ♥♥♥, nivel 01, nombre de usuario o "INVITADO") y el bezel siempre en estado "CARGANDO CARTUCHO", para cualquier `id` de juego válido o inválido.
- [ ] El botón PAUSA en la pantalla Jugador alterna a "SEGUIR" y muestra/oculta el overlay "PAUSA".
- [ ] En `/auth`, enviar el formulario de login o registro, o tocar "jugar como invitado", deja al usuario logueado (nombre visible en la navbar) y redirige a `/`.
- [ ] La sesión persiste tras recargar la página (localStorage) y "Salir" en la navbar vuelve al estado deslogueado.
- [ ] El Salón de la Fama muestra tabs por los 6 juegos; al cambiar de tab la tabla de top-10 cambia; si el usuario logueado aparece en la tabla, su fila se resalta con "TU MEJOR MARCA".
- [ ] El menú móvil (hamburguesa) abre/cierra el drawer con los mismos links que la navbar de escritorio.
- [ ] Ninguna pantalla incluye lógica de juego real (canvas jugable, iframe de cartucho, modal de "Fin de juego").
- [ ] `npm run lint` no reporta errores nuevos en los archivos creados o modificados dentro de `app/`, `lib/` o `components/`.

## Decisiones tomadas y descartadas

- **Rutas reales de Next.js** en vez de una SPA de una sola página: más idiomático en App Router y da URLs compartibles por pantalla.
- **Rutas en español** (`/juego/[id]`, `/jugar/[id]`, `/salon-de-la-fama`) para mantener consistencia con el resto del contenido, que está enteramente en español.
- **Sesión simulada con Context + localStorage, sin backend**: cualquier submit de login/registro "autentica" localmente, replicando el comportamiento de `references/js/auth.js`. Se decidió que sobreviva al refresh (a diferencia del estado en memoria de la referencia) porque el usuario lo pidió explícitamente.
- **Puntuaciones de solo lectura** (semilla determinística): no se implementa `push`/guardado de puntuaciones nuevas porque depende de una partida real, fuera de alcance de este MVP.
- **Se descarta el modal "Fin de juego"** (`AV.GameOver`): es inalcanzable sin lógica de juego real que dispare `die()`.
- **Se mantiene el GIF externo del hero** (`i.kym-cdn.com`) con un `<img>` plano (no `next/image`), para no tener que configurar `images.remotePatterns` para un asset externo tipo meme.
- **Se conserva el tema visual ya implementado** (`app/globals.css`, fuentes Press Start 2P / Courier Prime) sin modificaciones.

## Riesgos identificados

- El GIF externo (`i.kym-cdn.com`) es un recurso de terceros fuera de nuestro control: si desaparece o cambia, el hero queda roto. Mitigación: aceptable para un MVP visual; se puede reemplazar por un asset propio más adelante.
- Persistir la sesión en `localStorage` sin backend puede confundirse con autenticación real en el futuro. Mitigación: dejar documentado en el código (`lib/session-context.tsx`) que es una simulación sin backend.
- Las rutas dinámicas (`/juego/[id]`, `/jugar/[id]`) reciben un `id` que podría no existir en `lib/games.ts`. Mitigación: `getGameById` retorna `GAMES[0]` como fallback (igual que `AV.byId` en la referencia), documentado en el propio archivo.
