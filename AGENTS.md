# PROJECT KNOWLEDGE BASE - SafariDesk

**Generated:** 2026-03-09
**Commit:** 2d63918
**Branch:** main

## OVERVIEW

Helpdesk/ticketing system with Django REST backend and React frontend. Supports tickets, tasks, assets, knowledge base (with RAG), SLAs, email integrations, and real-time chat.

## STRUCTURE

```
sdesk/
├── backend/           # Django 5.1 + DRF + Celery + PostgreSQL (pgvector)
│   ├── tenant/        # Main business logic (tickets, tasks, KB, SLA)
│   ├── users/         # User management, auth, roles
│   ├── shared/        # Cross-cutting: Celery tasks, signals, middleware
│   └── util/          # Utilities: email, mail ingestion, security
├── frontend/          # React 18 + TypeScript + Vite + Tailwind
│   └── src/
│       ├── components/  # UI components, feature components
│       ├── pages/       # Route-level page components
│       ├── services/    # API clients
│       ├── stores/      # Zustand state stores
│       └── hooks/       # Custom React hooks
└── compose.yml        # Docker Compose (production)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Ticket CRUD | `backend/tenant/views/TicketView.py` | 3310 lines - complexity hotspot |
| Task management | `backend/tenant/views/TaskView.py` | 1266 lines |
| Knowledge base | `backend/tenant/views/KnowledgeBaseView.py`, `services/ai/` | RAG with pgvector |
| Email integration | `backend/util/mail/ingestion.py` | Gmail, Outlook OAuth |
| Celery tasks | `backend/shared/tasks.py` | 1487 lines - async jobs |
| Auth/JWT | `backend/users/routes/auth.py`, `frontend/src/stores/authStore.ts` | simplejwt, 1-day tokens |
| WebSocket chat | `backend/tenant/consumers/ChatConsumer.py` | Django Channels |
| AI features | `backend/tenant/services/ai/gemini_client.py` | Gemini integration |
| Frontend pages | `frontend/src/pages/` | Large files: all.tsx (2782), TasksPage.tsx (1791) |
| State management | `frontend/src/stores/` | Zustand (authStore, ticketStore) |
| API client | `frontend/src/services/http.ts` | Axios + JWT interceptor |

## CONVENTIONS (Non-Standard)

### Backend
- **Routes in `routes/` dirs** instead of `urls.py` per app
- **Models in `models/` dirs** with individual files instead of `models.py`
- **Views in `views/` dirs** with class-based views
- **Serializers in `serializers/` dirs** instead of `serializers.py`
- Project named `RNSafarideskBack` (capitalized, RN prefix from React Native heritage)

### Frontend
- **Dev server port 3600** (not 3000/5173)
- **Zustand** for global state (not Redux/Context)
- **@tanstack/react-query v5** for server state (legacy react-query v3 also installed - remove it)
- **routes/ directory** for route definitions (non-standard for React Router)

### Docker
- **Supervisor** in backend container (runs gunicorn + celery)
- **Daphne ASGI** on port 9100 (for WebSockets)
- **DragonflyDB** instead of Redis, **Percona PostgreSQL** instead of stock

## ANTI-PATTERNS (THIS PROJECT)

```
# DO NOT create notifications in TicketView.py:2734 - causes duplicates
# DO NOT run with DEBUG=True in production (settings/base.py)
# DO NOT commit SECRET_KEY to production
```

### Known TODOs
- `backend/tenant/models/AssetModel.py:695` - Update asset status on assignments
- `frontend/src/components/knowledge/ImageUpload.tsx:51` - Implement file upload
- `frontend/src/pages/task/mini/TaskActivityStream.tsx` - Close task functionality

## COMMANDS

```bash
# Development
docker compose up                    # Start all services
cd frontend && bun run dev           # Frontend only (port 3600)
cd backend && python manage.py runserver  # Backend only (port 8000)

# Backend
python manage.py migrate
python manage.py createsuperuser
celery -A RNSafarideskBack worker -l info
celery -A RNSafarideskBack beat -l info

# Frontend
cd frontend && bun run build
cd frontend && bun run lint
```

## NOTES

- **No test framework** on frontend (consider adding Vitest)
- **No CI/CD** in repo (no .github/workflows)
- **Duplicate files**: `compose.yml` + `docker-compose.yml`, `requirements.txt` + `req.txt`
- **Timezone**: Africa/Nairobi
- **Media storage**: /mnt/safaridesk
