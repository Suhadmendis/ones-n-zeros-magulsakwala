# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is a fresh `create-vite` React 19 scaffold (`ones-n-zeros-magulsakwala`), not yet customized. `src/App.jsx` still contains the default Vite+React starter markup (counter button, docs/social links). Treat it as a blank slate for the actual client project rather than existing product code to preserve.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the project

There is no test runner configured yet.

## Architecture

- Plain JS (no TypeScript), ES modules, React 19, bundled with Vite 8 (`@vitejs/plugin-react`, SWC-free default config).
- Entry point: `src/main.jsx` mounts `<App />` from `src/App.jsx` into `#root` (defined in `index.html`) inside `StrictMode`.
- Single-component app currently — no router, no state management library, no component directory structure established yet. When adding features, decide component/folder layout since none exists.
- Static assets referenced via `src/assets/` (imported into JSX) vs `public/` (referenced by absolute path, e.g. `public/icons.svg` used via `<use href="/icons.svg#...">`).
- ESLint config (`eslint.config.js`) uses flat config format with `@eslint/js` recommended rules, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` (Vite-specific fast-refresh rule). Lint scope is `**/*.{js,jsx}`, `dist/` ignored.
