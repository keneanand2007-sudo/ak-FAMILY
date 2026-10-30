# AK Family — Family OS

AK Family is a React single-page app for organizing a family workspace. It brings family members, health, education, finances, documents, places, alerts, and basic access-management tools together in one dashboard.

> **Project status:** This repository currently contains a frontend prototype. Authentication and app data are browser-local demos; there is no production backend, server-side authentication, or cloud synchronization. Do not enter real passwords, medical records, financial details, or other sensitive information.

## Features

- **Family workspace:** Create a family, add members, and open member profiles.
- **Dashboard and analytics:** Family overview, activity summaries, charts, and separate analytics pages for family, finance, health, education, places, documents, and permissions.
- **Finance:** Track income, expenses, budgets, assets, liabilities, and savings goals.
- **Health and emergency:** Maintain member health profiles, medical records, medications, appointments, emergency contacts, vaccinations, and health metrics. Emergency pages can prepare contact/share flows and show location details.
- **Education:** Keep education profiles, performance, exams, assignments, certificates, and skills by family member.
- **Places and tracking:** Save family places and use map/location interfaces. Place search and route lookup call public OpenStreetMap Nominatim and OSRM services.
- **Documents:** Record document details and expiry dates, with attachments handled by the browser UI.
- **Alerts:** See alerts derived from upcoming appointments, exams, expiring documents, and budget thresholds; dismiss or snooze alerts.
- **Family AI:** A local, rule-based assistant for supported family-data queries and a small set of add/update commands. It does not call an AI model or remote AI API.
- **Privacy and settings:** View role assignments, a permission matrix, audit-log information, and account/family/security/data settings.

## Requirements

- Node.js and npm (use a current Node.js release compatible with the installed Vite version).
- Internet access is only needed for map tiles, place search, and route lookups.

## Run locally

From the project directory, run:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

### Other scripts

```powershell
npm run build
npm run preview
npm run lint
```

- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the built bundle locally; run a build first.
- `npm run lint` runs ESLint against the project.

### Clear the Vite dependency cache (if needed)

This is a troubleshooting step, not part of normal startup:

```powershell
if (Test-Path node_modules\.vite) { Remove-Item -Recurse -Force node_modules\.vite }
npm run dev
```

## Demo access and first use

The login screen offers **Continue as Guest**. The local demo login in the source is:

- Email: `anand@example.com`
- Password: `123456`

You can also use the signup form, then create a family workspace during onboarding. These flows are for local demonstration only: credentials are not checked by a server, and newly signed-up accounts are kept in an in-memory list rather than a real account database.

`src/utils/seedDemoData.js` contains sample family data for development, but it is not automatically invoked by the application. Do not expect a seeded Sharma family to appear unless the seed helper is deliberately wired into a development flow.

## Application routes

| Route | Screen |
| --- | --- |
| `/auth` | Login and signup |
| `/onboarding` | Create a family and add members |
| `/dashboard` | Family dashboard |
| `/members`, `/member/:id` | Member list and profile |
| `/finance`, `/analytics/finance` | Finance workspace and analytics |
| `/health`, `/health/:id`, `/analytics/health` | Health workspace, member health, and analytics |
| `/emergency` | Emergency mode |
| `/education`, `/education/:id`, `/analytics/education` | Education workspace, member education, and analytics |
| `/places`, `/analytics/places` | Places and analytics |
| `/documents`, `/analytics/documents` | Documents and analytics |
| `/alerts` | Family alerts and alert preferences |
| `/ai` | Local Family AI |
| `/permissions`, `/analytics/permissions` | Roles, permissions, audit information, and analytics |
| `/analytics/family` | Family analytics |
| `/settings` | Account, family, security, and data settings |

Most workspace routes require a local signed-in state and a created family. Route protection is client-side and is not an authorization boundary.

## Tech stack

- React 19 and React DOM
- Vite with the React and Tailwind CSS plugins
- Tailwind CSS 4
- React Router 7
- Zustand with the `persist` middleware
- Recharts for charts
- Leaflet and React Leaflet for maps
- Lucide React for icons
- Axios is installed as a dependency

## Code layout

```text
src/
  App.jsx                 Route definitions and auth/onboarding gates
  main.jsx                React entry point and global imports
  layouts/                Shared dashboard layout/navigation
  components/             Shared UI components
  features/               Feature pages, components, stores, and helpers
  styles/                 Global styles
  utils/                  Demo data and reset helpers
public/                   Static assets
```

Feature areas are organized under `src/features/<feature>/`; many have their own `pages/`, `components/`, `store.js`, and `utils/` directories. Zustand persists application data in browser `localStorage` under keys such as `familyos-family-storage`, `familyos-health-storage`, and `familyos-finance-storage`. Clearing browser site data removes that local state.

## Current limitations

- No API server, database, account service, cloud backup, or multi-user synchronization is configured.
- The authentication store includes a hard-coded demo account. Signup is not durable as an account, and the password is included in client-side source; this must not be used as real authentication.
- Role and permission features are frontend demo functionality. Client-side checks and route gates cannot protect data from a user who can access the browser.
- Health, finance, and family data is stored in browser `localStorage` without a server-side security layer.
- Alert preferences are UI/local state; email, SMS, and push delivery integrations are not configured.
- Family AI uses local phrase matching and preset calculations, not a general-purpose AI model.
- Map search and route calculations depend on public third-party services and an internet connection.
- No test script or test runner is currently declared in `package.json`.

For the detailed repository state, feature/store inventory, and implementation notes, see [memory.md](./memory.md).

rm -rf node_modules/.vite
npm run dev