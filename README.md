## Arcade Vault

Es una plataforma para jugar online y competir por la mayor cantidad de puntos.

## Usa Spec Driven Design

Basado en /spec y /spec-impl

Siguiendo las buenas practicas recomendadas aquí:
https://github.com/Klerith/fernando-skills

## Skills usadas

```bash
npx skills@latest add Klerith/fernando-skills
```

## Variables de entorno

El formulario de contacto de `/sobre-nosotros` envía correos con [Resend](https://resend.com).
Crea un archivo `.env.local` en la raíz (no se versiona) con:

```bash
# Genera tu clave en https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

Nota: mientras se use el remitente sandbox `onboarding@resend.dev`, Resend solo entrega
al correo dueño de la cuenta de Resend.