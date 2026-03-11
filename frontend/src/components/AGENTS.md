# Components - UI & Feature Components

## OVERVIEW

Reusable UI components and feature-specific components organized by domain.

## STRUCTURE

```
components/
├── ui/               # Base UI primitives
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── Drawer.tsx
│   ├── Input.tsx
│   └── ...
├── layout/           # Layout components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── ...
├── tickets/          # Ticket-related components
├── tasks/            # Task-related components
├── knowledge/        # KB-related components
│   └── ImageUpload.tsx   # TODO: implement upload
├── settings/         # Settings components
├── chatbot/          # Chat widget
├── docs/             # Documentation components
└── shared/           # Cross-feature components
```

## CONVENTIONS

- **UI primitives** in `ui/` - reusable, no business logic
- **Feature components** in domain folders (tickets/, tasks/, etc.)
- **Barrel exports** via index.ts
- **Tailwind** for all styling
- **Radix UI** primitives for complex interactions

## PATTERNS

```typescript
// Standard component structure
interface ComponentProps {
  // Props with JSDoc comments
}

export function Component({ prop }: ComponentProps) {
  // Hooks at top
  // Handlers
  // Render
}
```

## WHERE TO LOOK

| Need | Location |
|------|----------|
| Button, Modal, etc. | `ui/` |
| Page layout | `layout/` |
| Ticket card/form | `tickets/` |
| Task components | `tasks/` |
| KB editor parts | `knowledge/` |

## ANTI-PATTERNS

- DO NOT add business logic to UI primitives
- DO NOT duplicate components across feature folders

## TODOs

- `knowledge/ImageUpload.tsx:51` - Implement actual file upload to backend
