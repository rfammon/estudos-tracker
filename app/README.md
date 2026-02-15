# Estudos Tracker

Aplicação web progressiva (PWA) para gestão e rastreamento de estudos para preparação de concursos públicos no Brasil.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open http://localhost:3000 in your browser.

## 📋 Tech Stack

- React 18 + TypeScript 5
- Vite 5
- Tailwind CSS
- shadcn/ui components
- Zustand (state management with LocalStorage persistence)
- React Router 6
- PWA with Service Workers

## 🎯 Sprint 1 - Foundation (Implemented)

### Epic 1: Gestão de Matérias e Organização (6 pts)
- ✅ US-001: Criar Novo Tópico de Estudo
- ✅ US-002: Categorizar Tópicos por Tipo
- ✅ US-003: Definir Prioridade de Estudo
- ✅ US-004: Editar Tópico Existente
- ✅ US-005: Excluir Tópico de Estudo

### Epic 2: Sistema de Registro de Tempo (Core - 5 pts)
- ✅ US-006: Iniciar Cronômetro de Estudo
- ✅ US-007: Pausar e Salvar Tempo de Estudo

## 📁 Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── layout/         # Layout with sidebar navigation
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Utilities
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Topics.tsx      # CRUD for subjects
│   │   └── Timer.tsx       # Study timer
│   ├── store/              # Zustand stores
│   │   ├── use-topic-store.ts    # Topics state
│   │   └── use-session-store.ts  # Sessions/timer state
│   ├── types/              # TypeScript definitions
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + Tailwind
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🎨 Design System

Colors follow the "Concurseiro Focado" theme:
- Primary: #2563EB (Blue Royal)
- Secondary: #0F172A (Dark Blue)
- Accent: #F59E0B (Golden Yellow)
- Success: #10B981 (Green)
- Error: #EF4444 (Red)

## 📱 PWA Features

The app works offline and can be installed on mobile devices:
- Service Worker for offline support
- Web App Manifest
- Mobile-responsive design with bottom navigation

## 🔜 Next Sprints

- Sprint 2: Session history, progress tracking
- Sprint 3: Gamification system
- Sprint 4: Study plan and scheduling
- Sprint 5: Dashboard enhancements
