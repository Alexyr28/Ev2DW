# Ev2DW — AGENTS.md

Ticket management system (full-stack). Backend: Spring Boot 4 + Java 21. Frontend: React 19 + Vite 8 + Tailwind CSS v4.

## Quick start

```bash
# Backend (requires PostgreSQL, DB "tickets_db")
cd tickets-backend
mvn spring-boot:run          # :8080

# Frontend
cd frontend
npm install
npm run dev                  # :5173
```

## Build & verify

| Task | Backend | Frontend |
|------|---------|----------|
| Build | `mvn package` | `npm run build` (runs `tsc -b && vite build`) |
| Test | `mvn test` | none |
| Lint | none | `npm run lint` (ESLint) |
| Dev | `mvn spring-boot:run` | `npm run dev` |

## Language & naming

- **Spanish throughout**: entities (`usuario`, `ticket`, `categoria`, `comentario`), fields (`titulo`, `descripcion`, `creadoPor`), roles (`ADMIN`, `TECNICO`, `USUARIO`), API messages, validation errors.
- API response envelope: `ApiResponse<T>` = `{ success, message, data }`.
- Ticket statuses: `ABIERTO`, `EN_PROCESO`, `PENDIENTE`, `RESUELTO`, `CERRADO`.
- Priorities: `BAJA`, `MEDIA`, `ALTA`, `CRITICA`.

## Auth

- JWT in `localStorage`. `http.ts` attaches `Bearer` token automatically and redirects to `/login` on 401.
- Login: `POST /api/auth/login`. Register (ADMIN only): `POST /api/auth/registro`.

## Seeded test data (DataInitializer)

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | ADMIN |
| `tecnico1` / `tecnico2` | `tecnico123` | TECNICO |
| `usuario1` / `usuario2` | `usuario123` | USUARIO |

## Ports & env

- Backend: `localhost:8080` (hardcoded in `application.properties`).
- Frontend: reads `VITE_API_URL` from `.env` (value `http://localhost:8080`). Fallback in `http.ts` is `http://localhost:8000` — if using without `.env`, update the fallback.
- Frontend `.env` is committed (dev-only).

## Key config quirks

- No CI/CD, no formatter, no pre-commit hooks.
- Backend uses `spring.jpa.open-in-view=false` (no lazy loading in views).
- Tailwind v4: uses `@import "tailwindcss"` syntax + `@tailwindcss/vite` plugin — no `tailwind.config.js`.
- TypeScript config split: `tsconfig.json` (references) + `tsconfig.app.json` + `tsconfig.node.json`. Build runs `tsc -b` first.
- Backend CORS configured programmatically in `SecurityConfig`, not via `application.properties` (the `cors.allowed-origins` property is unused).
- JWT secret is committed (dev-only, never for production).

## Architecture

```
Browser → Vite :5173 → fetch → Spring Boot :8080 → PostgreSQL
                              JWT auth (jjwt 0.12.3)
                              Spring Security (stateless)
                              Spring Data JPA / Hibernate
```

Backend layers: Controller → Service (interface + impl) → Repository → Entity.
Frontend: `AuthProvider` + `QueryClientProvider` in `main.tsx`. Routes in `App.tsx`. API calls in `src/api/*.ts`. Auth context in `src/context/AuthContext.tsx`.
