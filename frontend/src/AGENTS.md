# Frontend - React + TypeScript

## OVERVIEW

React 18 + TypeScript + Vite + TailwindCSS. Zustand for state, React Query for server state.

## STRUCTURE

```
src/
├── components/       # UI components (see components/AGENTS.md)
├── pages/            # Route-level components
│   ├── ticket/           # all.tsx (2782 lines!), ViewTicket.tsx
│   ├── task/             # TasksPage.tsx (1791 lines)
│   ├── knowledge/        # KB editor, articles
│   └── index.tsx         # Dashboard (1414 lines)
├── services/         # API clients
│   └── http.ts           # Axios instance + JWT interceptor
├── stores/           # Zustand stores
│   ├── authStore.ts      # Auth state
│   ├── ticketStore.ts    # Ticket state
│   └── userStore.ts      # User preferences
├── hooks/            # Custom hooks
├── utils/            # Helper functions
├── types/            # TypeScript definitions (index.tsx: 976 lines)
├── lib/              # Utilities (cn.ts for classnames)
└── routes/           # Route definitions (non-standard)
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add page | `pages/` + update `App.tsx` routes |
| Add API call | `services/` |
| Add global state | `stores/` |
| Add component | `components/` |
| Type definitions | `types/index.tsx` |
| Styling | Tailwind classes inline |
| API config | `services/http.ts` |

## CONVENTIONS

- **Dev port 3600** (vite.config.ts)
- **Zustand** for global state (NOT Redux/Context)
- **React Query** for server state
- **Tailwind** for styling (no CSS modules)
- **Barrel exports** via index.ts files

## STATE MANAGEMENT

| Store | Purpose |
|-------|---------|
| authStore | User, tokens, login/logout |
| ticketStore | Ticket filters, selections |
| userStore | User preferences |

## API CLIENT

```typescript
// services/http.ts
// Axios instance with:
// - Base URL from env
// - JWT Bearer token interceptor
// - Auto-refresh on 401
```

## ANTI-PATTERNS

- Remove legacy `react-query` package (keep `@tanstack/react-query` only)
- Large page files need splitting (all.tsx: 2782 lines)

## TODOs

- `components/knowledge/ImageUpload.tsx:51` - Implement file upload
- `pages/task/mini/TaskActivityStream.tsx` - Close task functionality

## COMMANDS

```bash
bun run dev      # Start dev server (port 3600)
bun run build    # Production build
bun run lint     # ESLint
bun run preview  # Preview production build
```

## ENV VARS

```
VITE_API_URL=http://localhost:8100/api/v1
VITE_WS_URL=ws://localhost:8101
VITE_SITE_URL=http://localhost:8000/site
```
