# Tenant App - Main Business Logic

## OVERVIEW

Core helpdesk functionality: tickets, tasks, assets, knowledge base, SLAs, chat.

## STRUCTURE

```
tenant/
├── models/           # Database models (14 files)
│   ├── TicketModel.py    # 1053 lines
│   ├── AssetModel.py     # 1247 lines
│   ├── KnowledgeBase.py  # 518 lines
│   └── ...
├── views/            # API views
│   ├── TicketView.py     # 3310 lines - BIGGEST FILE
│   ├── TaskView.py       # 1266 lines
│   ├── KnowledgeBaseView.py  # 1150 lines
│   └── ...
├── routes/           # URL routing (not urls.py)
├── serializers/      # DRF serializers
├── services/         # Business logic
│   └── ai/               # Gemini client, embeddings, KB search
├── consumers/        # WebSocket consumers
│   └── ChatConsumer.py   # 550 lines
├── management/       # Django management commands
└── tests.py          # Unit tests (GeminiClient, EmbeddingService)
```

## WHERE TO LOOK

| Feature | File |
|---------|------|
| Ticket CRUD | `views/TicketView.py` |
| Task CRUD | `views/TaskView.py` |
| Knowledge base | `views/KnowledgeBaseView.py` |
| AI/ML | `services/ai/gemini_client.py`, `embedding_service.py` |
| RAG search | `services/ai/kb_search.py` |
| WebSocket chat | `consumers/ChatConsumer.py` |
| SLA management | `views/SlaView.py` |
| Asset tracking | `views/AssetViews.py` |
| Mail integration | `models/MailIntegrationModel.py` |

## KEY MODELS

- **TicketModel** - status, priority, assignee, SLA, customer
- **TaskModel** - linked to tickets, status tracking
- **AssetModel** - hardware/software tracking
- **KnowledgeBase** - articles with vector embeddings
- **SLAModel** - response/resolution time policies

## CONVENTIONS

- Add new views to `views/` directory
- Add new routes to `routes/` directory (import in `__init__.py`)
- Complex logic → extract to `services/`
- AI features go in `services/ai/`

## ANTI-PATTERNS

```python
# TicketView.py:2734 - DO NOT create notifications here
# Will create duplicates!
```

## TODOs

- `models/AssetModel.py:695` - Update asset status on assignments
- `views/KnowledgeBaseView.py:445,483` - Send approval/rejection notifications

## SERVICES/AI

| Service | Purpose |
|---------|---------|
| `gemini_client.py` | Google Gemini API integration |
| `embedding_service.py` | Text embeddings for RAG |
| `kb_search.py` | Knowledge base semantic search |
