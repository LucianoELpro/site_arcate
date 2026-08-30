# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

Arcade Vault is a platform for playing games online and competing for the highest score (see README.md). The codebase is currently a fresh Next.js App Router scaffold (from `create-next-app`) — no game features exist yet.

## Commands

- `npm run dev` — start the dev server (Turbopack). This also regenerates AGENTS.md's warning block on every run — see AGENTS.md above for why it must stay committed.
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint via the flat config in `eslint.config.mjs`

No test runner is configured yet.
## Skill
Usa siempre /frontend-design para diseñar la interfaz de usuario


## Architecture

- Next.js 16.3.3, App Router only (`app/` directory), React 19, TypeScript in strict mode, Tailwind CSS v4 (via `@tailwindcss/postcss`, configured in `postcss.config.mjs`).
- Path alias `@/*` resolves to the repo root (`tsconfig.json`).
- **This Next.js version has breaking API/convention changes relative to training data.** Per AGENTS.md, read the relevant guide under `node_modules/next/dist/docs/` before writing or modifying framework-level code (routing, config, data fetching, etc.), and follow any deprecation notices found there.

## Workflow

This project follows Spec Driven Design using the `/spec` and `/spec-impl` skills from the `Klerith/fernando-skills` pack (`npx skills@latest add Klerith/fernando-skills`). Check whether those skills are installed before assuming they're available.
