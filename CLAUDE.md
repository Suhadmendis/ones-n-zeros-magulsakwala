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

## Backend

- Backend is **PHP, not Node.js** — target hosting panel (cPanel) doesn't support Node. Lives in `api/` at repo root (plain PHP files, PDO + MySQL, no framework).
- Endpoints: `api/content.php` (GET), `api/register.php` (POST, multipart), `api/health.php` (GET). Frontend calls them with the `.php` extension (e.g. `fetch('/api/content.php')`).
- `api/config.php` (gitignored, real DB credentials) is copied from `api/config.example.php`. Run `php api/migrate.php` once after deploy to create tables, `php api/seed_content.php` to seed English copy.
- Deploy: build frontend (`npm run build`) into `dist/`, upload `dist/` contents + `api/` to the panel's web root as siblings (so `/api/*.php` resolves alongside `index.html`). `public/.htaccess` (copied into `dist/` by Vite) handles SPA routing and lets `/api/*` requests pass through untouched.
- Local API dev: run `php -S localhost:8000` from repo root; Vite's dev server proxy forwards `/api` to it (`vite.config.js`).
