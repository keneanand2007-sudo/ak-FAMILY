# AK Family — Project Memory

This file is the durable working summary of the repository: what the app currently contains, how it is organized, where its data lives, and what is still only a prototype. Update it when implementation or project direction changes.

## Project summary

**AK Family** (the UI brands itself as **FAMILY OS**) is a browser-based family workspace built as a React single-page application. Its goal is to keep family, health, education, finance, documents, places, and related reminders together behind one dashboard-style interface.

This is currently a frontend prototype, not a deployed or production-ready service. No application API, database, server-side authentication, cloud sync, or remote AI integration is configured. Most app data is persisted in the browser with Zustand's `persist` middleware and `localStorage`.

## What exists in the current repository

The current working source includes:

- Authentication screens, a guest entry path, family creation, and member onboarding.
- A shared dashboard shell and family overview.
- Family member directory and individual profiles.
- Finance tracking for income, expenses, budget, assets, liabilities, and goals.
- Health records and member health details, including medication, appointments, emergency contacts, vaccinations, and metrics.
- Education records and member education details, including performance, exams, assignments, certificates, and skills.
- Saved places, map/location views, and route/geocoding helpers.
- Document records, attachments, and expiry tracking.
- Derived family alerts for upcoming appointments/exams, expiring documents, and budget thresholds.
- A local rule-based Family AI query/command interface.
- Role assignment, a permission matrix, audit-log UI, settings, and several analytics pages.
- Shared charts, cards, buttons, forms, and other feature components.

### Route inventory

Routes are declared in `src/App.jsx`.

| Route | Feature |
| --- | --- |
| `/auth` | Login/signup |
| `/onboarding` | Create family / add members |
| `/dashboard` | Family overview |
| `/members`, `/member/:id` | Member directory/profile |
| `/finance`, `/analytics/finance` | Finance and finance analytics |
| `/health`, `/health/:id`, `/analytics/health` | Health and health analytics |
| `/emergency` | Emergency mode |
| `/education`, `/education/:id`, `/analytics/education` | Education and education analytics |
| `/places`, `/analytics/places` | Places and places analytics |
| `/documents`, `/analytics/documents` | Documents and document analytics |
| `/alerts` | Derived alerts and local preferences |
| `/ai` | Local Family AI |
| `/permissions`, `/analytics/permissions` | Roles, permissions, audit information, analytics |
| `/analytics/family` | Family analytics |
| `/settings` | Account, family, security, and data settings |

Protected routes check the persisted client-side authentication flag and whether a family exists. These checks are navigation/UI behavior only; they do not provide server-side access control.

## Architecture and data flow

- `src/main.jsx` mounts the app, imports Leaflet CSS and global styles, and renders `App` in React Strict Mode.
- `src/App.jsx` defines routes and the auth/onboarding/protected-route gates.
- `src/layouts/DashboardLayout.jsx` provides the sidebar, navigation links, current user, logout action, and route-dependent visual theme.
- `src/features/<feature>/` groups feature pages, UI components, Zustand stores, and derived-data helpers.
- `src/utils/` contains cross-feature utilities such as the sample-data helper and factory reset helper.
- Analytics and alert content is calculated from local store data by feature utility functions; it is not fetched from a backend.
- `src/features/ai/utils/intentParser.js`, `queryExecutor.js`, and `commandExecutor.js` implement phrase matching, local data queries, and a limited set of write actions. Commands require an explicit confirmation in the UI.
- `src/features/tracking/utils/geocoding.js` calls the public Nominatim search service and OSRM route service. Leaflet map tiles are loaded from OpenStreetMap tile servers.

### Main persisted stores

| Store | `localStorage` key | Main data |
| --- | --- | --- |
| Authentication | `familyos-auth-storage` | Current user and signed-in flag |
| Family | `familyos-family-storage` | Family workspace and members |
| Health | `familyos-health-storage` | Member health profiles and records |
| Finance | `familyos-finance-storage` | Income, expenses, budget, assets, liabilities, goals |
| Education | `familyos-education-storage` | Per-member education data |
| Documents | `familyos-documents-storage` | Document records and attachment metadata |
| Places | `familyos-places-storage` | Saved places and location-sharing mode |
| Tracking | `familyos-tracking-storage` | Current/destination coordinates and member status |
| Permissions | `familyos-permissions-storage` | Role assignments and audit entries |
| Alerts | `familyos-alerts-storage` | Preferences, dismissed IDs, and snooze timestamps |

Because values are held in browser storage, they are tied to the browser profile/device and are not encrypted or synchronized by this app. Clearing site data removes them. Do not use real credentials or sensitive family, health, or finance information.

## Feature details and behavior

### Sign-in and onboarding

- `/auth` toggles between login and signup.
- The login screen supports guest entry.
- `src/features/auth/store.js` has a hard-coded local demo account (`anand@example.com` / `123456`); password checking happens entirely in the browser.
- Signup pushes a user into an in-memory array and stores the signed-in user in Zustand. There is no durable account registry or password service, so signing out/reloading cannot reliably authenticate that newly registered account.
- The onboarding component initializes to the create-family step. It currently routes to the dashboard on family creation; the alternate add-members step is present in the component but is not selected by the current flow.

### Domain features

- Finance calculations are shared through `src/features/finance/utils/financeCalculations.js`; the store delegates total calculation to that helper.
- Health and education data are keyed by family-member IDs.
- Documents support metadata, tags, attachment entries, and expiry dates. This describes the frontend data model; it does not imply secure or server-backed file storage.
- Alerts are derived from current local data. Snooze and dismiss state are persisted locally. Preference toggles do not, by themselves, send email, SMS, or push notifications.
- The AI feature is deterministic phrase parsing. Supported areas include savings, upcoming exams/appointments, alerts, expiring documents, member listing, adding income/expenses, and updating a member blood group. Unsupported requests receive a fallback response.
- Roles include Family Owner, Admin, Adult Member, Student, Child, Emergency Contact, and Viewer. Permission helpers expose a simple view/edit matrix; do not treat the UI matrix or protected routes as a security boundary.
- A sample Sharma-family dataset exists in `src/utils/seedDemoData.js`. A repository search at the time this memory was written found the helper definition but no application call site, so the seed data is not automatically loaded.

## Tooling and commands

The project is configured as an ES module Vite app. Main dependencies include React 19, React Router 7, Zustand, Tailwind CSS 4, Recharts, Leaflet/React Leaflet, and Lucide React. Axios is declared but no configured app API use was found during this review.

```powershell
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

Scripts are declared in `package.json`. There is currently no test script/test runner declared there. For Vite dependency-cache problems on Windows PowerShell:

```powershell
if (Test-Path node_modules\.vite) { Remove-Item -Recurse -Force node_modules\.vite }
npm run dev
```

## Known gaps and cautions

1. **Authentication is demo-only:** local hard-coded credentials, no server validation, password hashing, session service, or account persistence.
2. **Data is local and sensitive:** medical, financial, and family records are stored in browser `localStorage`; no encryption, backend policy, or cross-device backup exists.
3. **Permissions are not security controls:** role UI and client-side route gates do not enforce server authorization.
4. **Notifications are not delivered externally:** alert preferences and snooze/dismiss state are local-only; no email/push/SMS integration is configured.
5. **AI is not an LLM integration:** the feature uses a finite local intent parser and predefined actions/answers.
6. **Maps depend on third parties:** Nominatim, OSRM, and OpenStreetMap tile services need internet access and have their own availability/use policies.
7. **Reset coverage should be reviewed:** `src/utils/factoryReset.js` removes several store keys but does not currently list `familyos-tracking-storage`; tracking state can therefore remain after that helper runs.
8. **Sample data is not wired into startup:** the seed helper exists but is not automatically invoked.
9. **No automated test runner is configured:** validate changes with the existing ESLint and Vite production build unless a test setup is added.

## Validation snapshot (2026-10-30)

- `npm run build` **passes**. Vite reports that the generated JavaScript bundle is about 1.09 MB before gzip, above its 500 kB chunk-size advisory threshold.
- `npm run lint` **fails** on the current working tree with 12 errors and 4 warnings. Reported issues include unused variables, state updates directly inside effects, a browser global mutation flagged by the React hooks rules, and a prototype-method lint rule. They are in existing application source and were not changed as part of the documentation update.
- `git diff --check` **passes** for whitespace/error checks.

## Repository/history note

At the time this document was prepared, Git history showed a single commit (`2c8ca88`, `chore: initial project setup with feature-based folder structure`). The working tree already contained uncommitted application changes across the app, package manifests, Vite config, global styles, and feature/component directories. Those in-progress code changes were treated as existing work and were not reset or rewritten for this documentation task.

## Documentation

- [README.md](./README.md) is the user-facing project introduction, setup guide, route overview, and prototype disclaimer.
- This file (`memory.md`) is the deeper implementation and project-state reference.
