# 03 — Página "Sobre nosotros" en `/sobre-nosotros` con envío de correo vía Resend

- **Estado:** approved
- **Fecha:** 2026-09-01
- **Depende de:** SPEC 02
- **Objetivo (una frase):** Implementar la página "Acerca de" **tal cual** `references/home-about/home-about/about.jsx` en la ruta `/sobre-nosotros`, y hacer que su formulario de contacto envíe correos reales mediante Resend a través de un Route Handler.

## Alcance

**Incluido:**

- Nueva ruta `/sobre-nosotros` (`app/sobre-nosotros/page.tsx`, Client Component) que reproduce **tal cual** `references/home-about/home-about/about.jsx`: sección ABOUT (kicker "▸ ACERCA DE", título "ACERCA DE ARCADE VAULT", misión y la fila de tres `highlight` con sus íconos pixel HEART/BROWSER/PLANT), el `about-divider` con los 24 píxeles animados, y la sección CONTACTO (intro con tips + formulario nombre/correo/mensaje).
- Puerto del componente `HighlightIcon` (los tres SVG pixel-art) como parte de la página.
- Animación de aparición al hacer scroll (`.reveal` → `.in`) con `IntersectionObserver`, igual que en la referencia. Reutiliza el `useReveal` ya portado por el spec 02 si es exportable; si no, se replica el efecto en el propio Client Component.
- CSS específico de about portado desde `references/home-about/home-about/styles.css` (clases `about`, `about-hero`, `about-title`, `about-mission`, `highlight-row`, `highlight`, `hl-icon`, `hl-text`, `about-divider`, `div-bar`, `div-pixels`, `about-contact`, `contact-grid`, `contact-intro`, `contact-tips`, `tip`, `tip-led`, `contact-form`, `field`, `shake`, `terminal-success`, `term-bar`, `term-body`, `dot`, `caret`, etc.) a un archivo co-localizado `app/sobre-nosotros/sobre-nosotros.css`, scoped bajo `.home-av` para reusar el tema base ya portado (variables neón, `.btn`, `.kicker`, `.pixel`, `.reveal`).
- Route Handler `app/api/contacto/route.ts` (POST) que recibe `{ name, email, msg }`, valida en servidor y envía el correo con Resend.
- Integración con Resend: instalar el paquete `resend`, leer `RESEND_API_KEY` desde `.env.local`, enviar desde el remitente sandbox `onboarding@resend.dev` al destino `lugel.vargas14@gmail.com`, con `reply_to` igual al correo del visitante.
- Estados del formulario:
  - **Éxito** → terminal "VAULT-OS" **idéntica** a la referencia, con el nombre del visitante y el botón "ENVIAR OTRO MENSAJE" que reinicia el formulario.
  - **Error de envío** (Resend falla o la red cae) → **nuevo** bloque de error con la misma estética de terminal (líneas `[FAIL]` en rojo) y botón "REINTENTAR" que vuelve al formulario con los datos intactos.
  - **Validación de campos vacíos** → efecto `shake` existente, sin enviar (igual que la referencia).
  - **Cargando** → el botón "ENVIAR MENSAJE" se deshabilita y muestra "TRANSMITIENDO…" mientras la petición está en curso.
- Reconexión del navbar (`components/nav-bar.tsx`): el enlace "Acerca de" pasa de `/juegos` (provisional del spec 02) a `/sobre-nosotros`, tanto en escritorio como en el drawer móvil, con estado activo por `usePathname()`.

**Explícitamente fuera de alcance:**

- Persistencia de los mensajes enviados (base de datos, tabla de contactos, historial): no se guarda nada, solo se envía el correo.
- Rate limiting, CAPTCHA o protección anti-spam del endpoint: se difiere a otra spec.
- Verificación de dominio propio en Resend y remitente personalizado (ej. `contacto@arcadevault.gg`): se usa el sandbox `onboarding@resend.dev`; el dominio propio queda para otra spec.
- Correo de confirmación/autorespuesta al visitante: solo se envía el mensaje al equipo, no se responde automáticamente al remitente.
- Plantilla HTML elaborada del correo: el cuerpo del correo es texto/HTML mínimo con nombre, correo y mensaje; no se diseña un email maquetado.
- Cambios en el home (`/`), la biblioteca (`/juegos`) o cualquier pantalla del spec 01, más allá del enlace "Acerca de" del navbar.

## Modelo de datos

Esta feature **no introduce estructuras de datos persistentes**. El único contrato de datos es el cuerpo de la petición al Route Handler:

```ts
// POST /api/contacto — cuerpo de la petición
type ContactPayload = {
  name: string;   // requerido, no vacío tras trim
  email: string;  // requerido, formato de correo válido
  msg: string;    // requerido, no vacío tras trim
};

// Respuesta
// 200 → { ok: true }
// 400 → { ok: false, error: "VALIDACION" }   (campos vacíos o correo inválido)
// 500 → { ok: false, error: "ENVIO" }         (Resend o config falló)
```

Variable de entorno (no se commitea; `.env*` ya está en `.gitignore`):

- `RESEND_API_KEY` — la crea y coloca el usuario en `.env.local`. Se documenta en el `README.md`.

## Plan de implementación

1. **Dependencia y entorno.** Instalar `resend` (`npm install resend`). Crear `.env.local` con `RESEND_API_KEY=` (valor vacío, lo llena el usuario) y documentar la variable en `README.md`. Confirmar que `.env.local` queda ignorado por `.gitignore`.
2. **Route Handler.** Crear `app/api/contacto/route.ts` con un `POST` que: parsea el JSON, valida `name`/`email`/`msg` (no vacíos + correo con formato válido → 400 si falla), instancia `Resend` con `RESEND_API_KEY`, envía con `from: onboarding@resend.dev`, `to: lugel.vargas14@gmail.com`, `reply_to: email`, asunto tipo `Nuevo mensaje de {name} — Arcade Vault`, cuerpo con los tres campos. Devuelve `{ ok: true }` en éxito y 500 `{ ok:false, error:"ENVIO" }` si Resend lanza o la key falta. Antes de escribirlo, revisar la guía de Route Handlers en `node_modules/next/dist/docs/` (AGENTS.md).
3. **CSS de about.** Portar las clases específicas de about desde `references/home-about/home-about/styles.css` a `app/sobre-nosotros/sobre-nosotros.css`, scoped bajo `.home-av`. Añadir las clases del **nuevo** estado de error de terminal (`[FAIL]` en rojo) reutilizando la estética de `.terminal-success`. No duplicar variables ni `.btn`/`.kicker`/`.pixel`/`.reveal` (ya existen en `globals.css`/`home-arcade.css`).
4. **Página.** Crear `app/sobre-nosotros/page.tsx` (Client Component) portando `about.jsx`: raíz con `.home-av` + `.about`, secciones ABOUT/divider/CONTACTO, `HighlightIcon`, importar `./sobre-nosotros.css`. Sustituir el `onSubmit` simulado por un `fetch('/api/contacto', { method:'POST', ... })` con los estados `idle | sending | sent | error`: éxito → terminal VAULT-OS con el nombre; error → bloque de error + "REINTENTAR"; campos vacíos → `shake`; en curso → botón deshabilitado "TRANSMITIENDO…".
5. **Navbar.** En `components/nav-bar.tsx`, cambiar el destino de "Acerca de" de `/juegos` a `/sobre-nosotros` (escritorio y drawer), verificando que el estado activo por `usePathname()` funcione en la nueva ruta.
6. **Revisión visual y funcional.** Con `npm run dev`: comparar `/sobre-nosotros` contra `about.jsx` (layout, íconos, divider, terminal), enviar el formulario con la key real y confirmar que llega el correo a `lugel.vargas14@gmail.com`; forzar un fallo (key vacía) y confirmar que aparece el estado de error; enviar con campos vacíos y confirmar el `shake`.

## Criterios de aceptación

- [ ] `npm run build` compila sin errores con la ruta `/sobre-nosotros` y el endpoint `/api/contacto`.
- [ ] `/sobre-nosotros` reproduce visualmente `about.jsx`: kicker "▸ ACERCA DE", título, misión, los tres `highlight` con íconos HEART/BROWSER/PLANT, el `about-divider` con píxeles animados, y la sección CONTACTO con sus tres tips y el formulario.
- [ ] Las secciones con `.reveal` aparecen con la animación al hacer scroll (IntersectionObserver funcionando).
- [ ] Enviar el formulario con nombre, correo y mensaje válidos entrega un correo a `lugel.vargas14@gmail.com` con `reply-to` igual al correo del visitante.
- [ ] Tras un envío exitoso se muestra la terminal "VAULT-OS" idéntica a la referencia, con el nombre del visitante en mayúsculas, y "ENVIAR OTRO MENSAJE" reinicia el formulario vacío.
- [ ] Si el envío falla (ej. `RESEND_API_KEY` vacía o Resend responde error), aparece el estado de error con estética de terminal y "REINTENTAR" devuelve al formulario con los datos aún escritos.
- [ ] Enviar con cualquier campo vacío dispara el `shake` y **no** hace la petición al endpoint.
- [ ] Mientras la petición está en curso, el botón de envío queda deshabilitado y muestra "TRANSMITIENDO…" (no permite doble envío).
- [ ] El enlace "Acerca de" del navbar (escritorio y drawer móvil) lleva a `/sobre-nosotros` y se resalta como activo en esa ruta.
- [ ] `RESEND_API_KEY` se lee desde `.env.local`, `.env.local` no está versionado y la variable está documentada en `README.md`.
- [ ] `npm run lint` no reporta errores nuevos en los archivos creados o modificados dentro de `app/`, `lib/` o `components/`.

## Decisiones tomadas y descartadas

- **Ruta `/sobre-nosotros`** (en vez de `/acerca` o `/about`): elegida por el usuario; se mantiene el español coherente con `/salon-de-la-fama`, `/juego`, `/jugar`.
- **Route Handler `/api/contacto`** en vez de Server Action: elegido por el usuario. Expone un endpoint POST explícito llamado con `fetch` desde el cliente.
- **Remitente sandbox `onboarding@resend.dev`** en vez de dominio propio verificado: no requiere configurar DNS. Limitación conocida: Resend en sandbox **solo entrega al correo dueño de la cuenta** (`lugel.vargas14@gmail.com`); enviar a otro destinatario se rechazaría. Migrar a dominio propio queda para otra spec.
- **Se añade un estado de error** de terminal (no existente en `about.jsx`) en vez de reusar solo el `shake`: con envío real el usuario necesita saber si el mensaje falló; se mantiene el éxito idéntico a la referencia y el error hereda su estética.
- **La API key la coloca el usuario** en `.env.local`; la spec no genera ni commitea ninguna clave. `.env*` ya está en `.gitignore`.
- **Sin persistencia ni anti-spam**: el MVP solo envía el correo; guardar mensajes y limitar abuso se difieren a specs futuras.
- **CSS de about co-localizado y scoped bajo `.home-av`**: reutiliza el tema base del spec 02 sin duplicar variables ni botones, y evita colisiones con el tema del placeholder.

## Riesgos identificados

| Riesgo | Mitigación |
| --- | --- |
| Con la sandbox, Resend rechaza envíos a destinos distintos del dueño de la cuenta. | El destino es fijo (`lugel.vargas14@gmail.com`); se documenta que cambiar destino exige verificar dominio (otra spec). |
| `RESEND_API_KEY` ausente o vacía en despliegue rompe el envío. | El Route Handler devuelve 500 controlado y la UI muestra el estado de error en vez de romper; la variable se documenta en `README.md`. |
| Colisión de clases CSS entre `sobre-nosotros.css` y el tema base. | Portar solo las clases específicas de about, scoped bajo `.home-av`; no redefinir variables ni `.btn`/`.kicker`/`.pixel`/`.reveal`. |
| Endpoint sin rate limiting expuesto a spam. | Aceptado para el MVP; anti-spam/rate limiting se difiere explícitamente a otra spec. |

## Lo que **no** entra en esta spec

- Persistencia de mensajes de contacto.
- Rate limiting, CAPTCHA o anti-spam.
- Dominio propio verificado en Resend y remitente personalizado.
- Autorespuesta o correo de confirmación al visitante.

Cada uno de esos, si se hace, va en su propia spec.
