# 02 — Home de marketing en `/` y placeholder movido a `/juegos`

- **Estado:** approve
- **Fecha:** 2026-09-01
- **Depende de:** ninguno
- **Objetivo (una frase):** Implementar la landing de marketing de la referencia `references/home-about/home-about` (home + navbar + estilos, sin `about.jsx`) como la ruta `/`, y mover el placeholder actual de `/` a `/juegos`.

## Alcance

**Incluido:**

- Nueva ruta `/` (`app/page.tsx`) que reproduce **tal cual** `references/home-about/home-about/home.jsx`: hero con siluetas flotantes y CTAs, sección "¿POR QUÉ ARCADE VAULT?" (4 feature cards), preview "JUEGOS DISPONIBLES AHORA" (6 mini-cards), franja de stats, sección "ACTIVIDAD EN VIVO" (últimas puntuaciones + top jugadores), sección "PRECIOS" (plan único + FAQ) y CTA final.
- Navbar global (`components/nav-bar.tsx`) portado de `references/home-about/home-about/nav.jsx`: logo, enlaces (Inicio, Biblioteca, Salón de la Fama, Acerca de), contador de créditos, botón de sesión y drawer móvil con hamburguesa. Se monta en `app/layout.tsx`, por lo que aparece en `/` y en `/juegos`.
- Estilos de la referencia (`references/home-about/home-about/styles.css`) adaptados al proyecto: tema base (variables neón, fondo grid/scanlines, botones), navbar y todas las clases del home (`.home-hero`, `.feature-card`, `.mini-rail`, `.home-stats`, etc.).
- Catálogo mínimo de juegos para el preview del home, con los 6 juegos y su arte de portada CSS (`cover-*`), de modo que las mini-cards se rendericen idénticas a la referencia.
- Animación de aparición al hacer scroll (`useReveal` con `IntersectionObserver`) y decorados (`FloatingSilhouettes`, `FeatureIcon`) portados como Client Components.
- Nueva ruta `/juegos` (`app/juegos/page.tsx`) que contiene **exactamente** el placeholder que hoy vive en `/` (hero "ARCADE VAULT / INSERTA UNA MONEDA PARA JUGAR / Compite por la mayor cantidad de puntos en la bóveda."), con su CSS actual intacto.
- Reconexión de la navegación del home y del navbar hacia las rutas reales existentes:
  - "Inicio" → `/`
  - "Biblioteca" → `/juegos`
  - CTAs del home que exploran juegos (EXPLORAR JUEGOS, VER TODOS LOS JUEGOS, INSERTAR MONEDA →) → `/juegos`

**Explícitamente fuera de alcance:**

- El archivo `about.jsx` de la referencia: **no** se implementa la página "Acerca de" ni su ruta.
- Las pantallas del spec 01 (Detalle `/juego/[id]`, Jugador `/jugar/[id]`, Auth `/auth`, Salón de la Fama `/salon-de-la-fama`): no se construyen aquí. Los enlaces/botones que en la referencia apuntan a ellas (mini-cards → detalle, CREAR CUENTA / botón de sesión → auth, VER SALÓN → salón, "Salón de la Fama" y "Acerca de" del navbar) apuntan **provisionalmente a `/juegos`** en este spec.
- Sesión real o simulada, autenticación, buscador/filtros de la biblioteca, puntuaciones sembradas: todo eso pertenece al spec 01 y no se toca aquí.
- Datos "en vivo" reales: las listas de "ACTIVIDAD EN VIVO", stats y precios se portan como contenido estático hardcodeado, igual que en la referencia.

## Modelo de datos

- **`lib/home-games.ts`** — datos mínimos para el preview del home:
  - `type HomeGame = { id: string, title: string, cat: string, cover: string }` (donde `cover` es la clase CSS de portada, p. ej. `cover-snake`).
  - `HOME_GAMES: HomeGame[]` con los 6 juegos que muestra la referencia y sus portadas `cover-*`.

  Nota: si al implementar el spec 01 se crea `lib/games.ts`, este módulo debería fusionarse con él; se mantiene separado aquí para no invadir el alcance del spec 01.

- El resto del contenido del home (feature cards, stats, tickers de actividad, top jugadores, precios/FAQ) se define **inline** en el componente, tal como en `home.jsx`. No introduce estructuras de datos nuevas.

## Plan de implementación

1. **Estilos.** Adaptar `references/home-about/home-about/styles.css` al proyecto: incorporar el tema base (variables, fondo, botones neón), las clases del navbar y todas las clases del home. Antes de tocar CSS/convenciones de Next, revisar la guía correspondiente en `node_modules/next/dist/docs/` (AGENTS.md). Mantener intactas las clases del placeholder actual (`.screen`, `.hero`, `.title`, etc.) para que `/juegos` no cambie.
2. **Navbar.** Crear `components/nav-bar.tsx` (Client Component) portando `nav.jsx`: enlaces con `next/link` + `usePathname()` para el estado activo, estado local `menuOpen` para el drawer y backdrop. Montarlo en `app/layout.tsx` por encima de `{children}` (dentro de `#app`). "Salón de la Fama", "Acerca de" y el botón de sesión apuntan a `/juegos` provisionalmente.
3. **Mover el placeholder.** Crear `app/juegos/page.tsx` con el contenido exacto del `app/page.tsx` actual.
4. **Datos del preview.** Crear `lib/home-games.ts` con `HOME_GAMES` (6 juegos + `cover-*`).
5. **Home.** Reescribir `app/page.tsx` (Client Component) portando `home.jsx`: `useReveal`, `FloatingSilhouettes`, `FeatureIcon`, `MiniCard`, y todas las secciones. Sustituir las llamadas `navigate({...})` por navegación real (`next/link` o `useRouter`) según el mapeo del alcance (explorar juegos → `/juegos`; destinos aún no construidos → `/juegos`).
6. **Revisión visual.** Con `npm run dev`, comparar `/` contra la referencia (`home.jsx` / standalone) y verificar que `/juegos` muestra el placeholder anterior sin cambios, incluido el navbar en ambas rutas y el drawer móvil.

## Criterios de aceptación

- [ ] `npm run build` compila sin errores con las rutas `/` y `/juegos`.
- [ ] `/` muestra el home de la referencia con todas sus secciones: hero + siluetas, "¿POR QUÉ ARCADE VAULT?" (4 cards), "JUEGOS DISPONIBLES AHORA" (6 mini-cards), stats, "ACTIVIDAD EN VIVO", "PRECIOS" y CTA final.
- [ ] Las secciones marcadas con `reveal` aparecen con la animación al hacer scroll (IntersectionObserver funcionando).
- [ ] Las 6 mini-cards del preview se ven con su portada `cover-*` y su categoría, igual que en la referencia.
- [ ] `/juegos` muestra exactamente el placeholder que antes estaba en `/` ("ARCADE VAULT / INSERTA UNA MONEDA PARA JUGAR / Compite por la mayor cantidad de puntos en la bóveda.").
- [ ] El navbar aparece en `/` y en `/juegos`; "Inicio" lleva a `/` y "Biblioteca" lleva a `/juegos`, con el enlace activo resaltado según la ruta.
- [ ] Los CTAs del home que exploran juegos (EXPLORAR JUEGOS, VER TODOS LOS JUEGOS, INSERTAR MONEDA) navegan a `/juegos`.
- [ ] Los enlaces/botones a rutas aún no construidas (mini-cards, CREAR CUENTA, VER SALÓN, "Salón de la Fama", "Acerca de", botón de sesión) navegan a `/juegos` sin romper (no hay enlaces a `#` ni errores 404).
- [ ] La hamburguesa abre/cierra el drawer móvil con los mismos enlaces que el navbar de escritorio.
- [ ] No se crea ninguna página "Acerca de" ni se usa `about.jsx`.
- [ ] `npm run lint` no reporta errores nuevos en los archivos creados o modificados dentro de `app/`, `lib/` o `components/`.

## Decisiones tomadas y descartadas

- **`/` pasa a ser el home de marketing y `/juegos` recibe el placeholder actual.** Esto **actualiza** el mapeo del spec 01 (que asumía `/` = Biblioteca): cuando se implemente el spec 01, la Biblioteca vivirá en `/juegos`, no en `/`.
- **Enlaces a rutas no construidas → `/juegos`** (en vez de crear rutas stub "próximamente" o de ocultar los enlaces): mantiene el home **tal cual** visualmente y totalmente navegable, sin inventar pantallas fuera de alcance. Se reconectarán al implementar el spec 01.
- **CSS del reference adaptado al proyecto, con estilos co-localizados por ruta cuando aplique**, en vez de reescribir el diseño con utilidades Tailwind: prioriza la paridad pixel-a-pixel con la referencia. Se conservan las clases del placeholder para no alterar `/juegos`.
- **Navbar global en `layout.tsx`** (aparece también en `/juegos`), en vez de montarlo solo en el home: da navegación consistente entre ambas rutas y evita duplicar el componente.
- **`about.jsx` descartado por pedido explícito del usuario:** no se implementa la página "Acerca de" en este spec.
- **Contenido dinámico simulado como estático** (actividad en vivo, stats, precios): se porta hardcodeado igual que la referencia; no se conecta a ninguna fuente de datos real.

## Riesgos identificados

- **Colisión de clases CSS** entre el tema del reference (`styles.css`) y el `globals.css` actual (que usa otro tema con Tailwind v4 y clases como `.screen`/`.hero`/`.title`). Mitigación: revisar solapamientos al adaptar y mantener el CSS del placeholder aislado para que `/juegos` no cambie de aspecto.
- **Enlaces provisionales a `/juegos`** pueden confundirse con navegación definitiva. Mitigación: dejar comentado en el código que son destinos temporales hasta implementar el spec 01.
- **Desalineación de datos con el futuro `lib/games.ts`** del spec 01 (aquí se usa `lib/home-games.ts` con forma `{id,title,cat,cover}`). Mitigación: documentar en el propio archivo que debe fusionarse con `lib/games.ts` cuando exista.
