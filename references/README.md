# ARCADE VAULT — versión local (HTML + CSS + JS)

Sin build ni dependencias. Abre `index.html` en el navegador (doble clic funciona;
para el iframe de cartuchos externos usa un servidor: `npx serve` o `python3 -m http.server`).

## Estructura

    index.html          marcado base, capas de fondo, orden de scripts
    css/styles.css      todos los estilos (variables de color, neón, CRT, responsive)
    js/data.js          catálogo de juegos + utilidades
    js/storage.js       puntuaciones en localStorage · punto de conexión al backend
    js/nav.js           navbar sticky + menú móvil
    js/library.js       biblioteca, buscador y filtros
    js/detail.js        ficha del juego + mejores puntuaciones
    js/player.js        bezel CRT, demo de NEÓN SERPIENTE, modal de fin de juego
    js/auth.js          iniciar sesión / crear cuenta / invitado
    js/hall.js          salón de la fama
    js/app.js           estado, router y todos los eventos

## Cargar un juego externo

Coloca el HTML del cartucho en `juegos/` y llama:

    AV.Player.loadCartridge('juegos/mi-juego.html');

Se monta en un `<iframe sandbox="allow-scripts">` dentro del bezel CRT.

## Conectar un backend

- `js/storage.js`: reemplaza `all()` y `push()` por `fetch('/api/scores/:juego')` (GET/POST) o Supabase.
- `js/auth.js` + acción `login` en `js/app.js`: reemplaza el usuario simulado por la respuesta real de la API.
