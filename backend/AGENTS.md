# Backend - Django REST API

## OVERVIEW

Django 5.1 + DRF + Celery + PostgreSQL (pgvector). Multi-tenant helpdesk API with JWT auth.

## STRUCTURE

```
backend/
├── RNSafarideskBack/   # Project config (settings split: base/dev/prod)
├── tenant/             # Main app: tickets, tasks, assets, KB, SLA
├── users/              # Auth, user model, roles, teams
├── shared/             # Tasks, signals, middleware, cron
├── util/               # Email, mail ingestion, security
└── main/               # Core utilities
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add API endpoint | `tenant/routes/` + `tenant/views/` |
| Modify models | `tenant/models/`, `users/models/` |
| Add Celery task | `shared/tasks.py` |
| Email templates | `util/email/templates.py` |
| Mail ingestion | `util/mail/ingestion.py` |
| AI/ML features | `tenant/services/ai/` |
| Auth logic | `users/routes/auth.py` |
| Middleware | `shared/middleware/` |
| Settings | `RNSafarideskBack/settings/base.py` |

## CONVENTIONS

- Routes go in `routes/` directory, not `urls.py`
- Models split into `models/` directory (one file per model)
- Views split into `views/` directory
- Serializers split into `serializers/` directory
- Business logic goes in `services/` when complex

## MODELS

- `users.Users` - Custom user model (AUTH_USER_MODEL)
- `tenant.TicketModel` - Tickets (1053 lines)
- `tenant.TaskModel` - Tasks linked to tickets
- `tenant.AssetModel` - Asset tracking (1247 lines)
- `tenant.KnowledgeBase` - KB articles with RAG (518 lines)
- `tenant.SLAModel` - Service level agreements
- `tenant.MailIntegration` - Gmail/Outlook OAuth

## API

- Base URL: `/api/v1/`
- Auth: JWT Bearer (1-day tokens)
- Pagination: LimitOffsetPagination (page_size=10)
- Filters: DjangoFilterBackend + SearchFilter + OrderingFilter

## ANTI-PATTERNS

- DO NOT create notifications in `TicketView.py:2734` - duplicates
- DO NOT use `urls.py` - use `routes/` directory

## COMMANDS

```bash
python manage.py runserver          # Dev server
python manage.py migrate            # Run migrations
python manage.py test               # Run tests (tenant/tests.py has some)
celery -A RNSafarideskBack worker   # Celery worker
celery -A RNSafarideskBack beat     # Celery scheduler
```
