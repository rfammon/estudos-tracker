# Estudos Tracker - Documento de Arquitetura Técnica

**Projeto:** Estudos Tracker  
**Autor:** Ammon (Architect)  
**Data:** 2026-02-14  
**Versão:** 1.0  
**Idioma:** Português Brasil

---

## Sumário Executivo

Este documento descreve a arquitetura técnica completa do Estudos Tracker, uma aplicação web progressiva (PWA) para gestão e rastreamento de estudos para preparação de concursos públicos no Brasil. A arquitetura foi projetada seguindo as decisões técnicas definidas no UX Design: React + shadcn/ui + Tailwind CSS, PWA com service workers e armazenamento local (Local Storage) para o MVP.

---

## 1. Estrutura do Projeto

### 1.1 Visão Geral da Estrutura

```
estudos-tracker/
├── public/
│   ├── manifest.json          # Manifesto PWA
│   ├── service-worker.js      # Service Worker
│   ├── icons/                 # Ícones PWA
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── bottom-nav.tsx
│   │   │   └── header.tsx
│   │   ├── features/          # Componentes de funcionalidade
│   │   │   ├── timer/
│   │   │   │   ├── timer.tsx
│   │   │   │   ├── timer-display.tsx
│   │   │   │   └── timer-controls.tsx
│   │   │   ├── topics/
│   │   │   │   ├── topic-card.tsx
│   │   │   │   ├── topic-list.tsx
│   │   │   │   └── topic-form.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── stats-card.tsx
│   │   │   │   ├── progress-chart.tsx
│   │   │   │   └── streak-display.tsx
│   │   │   ├── gamification/
│   │   │   │   ├── achievement-badge.tsx
│   │   │   │   ├── level-display.tsx
│   │   │   │   └── points-counter.tsx
│   │   │   └── study-plan/
│   │   │       ├── weekly-calendar.tsx
│   │   │       ├── daily-goal.tsx
│   │   │       └── reminder-config.tsx
│   │   └── hooks/             # Custom hooks React
│   │       ├── use-timer.ts
│   │       ├── use-local-storage.ts
│   │       ├── use-pwa.ts
│   │       └── use-notifications.ts
│   ├── lib/
│   │   ├── storage.ts         # Abstração Local Storage
│   │   ├── db.ts              # Schema e operações DB
│   │   ├── utils.ts           # Funções utilitárias
│   │   └── constants.ts       # Constantes da aplicação
│   ├── store/                 # Estado global (Zustand)
│   │   ├── use-topic-store.ts
│   │   ├── use-session-store.ts
│   │   ├── use-gamification-store.ts
│   │   └── use-study-plan-store.ts
│   ├── types/                 # TypeScript definitions
│   │   ├── topic.ts
│   │   ├── session.ts
│   │   ├── achievement.ts
│   │   └── index.ts
│   ├── pages/                 # Rotas/Pages
│   │   ├── dashboard.tsx
│   │   ├── topics.tsx
│   │   ├── timer.tsx
│   │   ├── study-plan.tsx
│   │   ├── achievements.tsx
│   │   └── settings.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── index.html
```

### 1.2 Diretórios e Responsabilidades

| Diretório | Responsabilidade |
|-----------|------------------|
| `public/` | Arquivos estáticos, manifesto PWA, service worker |
| `src/components/ui/` | Componentes base do shadcn/ui |
| `src/components/layout/` | Componentes de layout (sidebar, header) |
| `src/components/features/` | Componentes de negócio por funcionalidade |
| `src/components/hooks/` | Custom hooks React para lógica reutilizável |
| `src/lib/` | Utilitários, abstração de storage, schema DB |
| `src/store/` | Estado global com Zustand |
| `src/types/` | Definições TypeScript |
| `src/pages/` | Componentes de página (rotas) |

---

## 2. Stack Tecnológica Detalhada

### 2.1 Camada de Frontend

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **React** | 18.x | Biblioteca UI principal |
| **TypeScript** | 5.x | Tipagem estática para segurança |
| **Vite** | 5.x | Build tool rápido e moderno |
| **Tailwind CSS** | 3.x | Framework CSS utility-first |
| **shadcn/ui** | Latest | Componentes acessíveis baseados em Radix UI |
| **React Router** | 6.x | Roteamento SPA |

### 2.2 Estado Global e Persistência

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Zustand** | 4.x | Estado global leve e simples |
| **Zustand/middleware** | - | Persistência automática no Local Storage |
| **Local Storage API** | - | Armazenamento offline-first |

### 2.3 Utilitários

| Biblioteca | Versão | Uso |
|------------|--------|-----|
| **clsx** | Latest | Condicional classes CSS |
| **tailwind-merge** | Latest | Merge classes Tailwind |
| **date-fns** | 3.x | Manipulação de datas |
| **uuid** | 9.x | Geração de IDs únicos |
| **react-hot-toast** | Latest | Notificações toast |

### 2.4 Ferramentas de Desenvolvimento

| Ferramenta | Uso |
|------------|-----|
| **ESLint** | Linting código |
| **Prettier** | Formatação código |
| **Husky** | Git hooks |
| **lint-staged** | Lint staged files |

---

## 3. Arquitetura de Dados

### 3.1 Schema do Local Storage

O Local Storage será dividido em chaves namespaces para organizar os dados:

```typescript
// Namespace de dados
const STORAGE_KEYS = {
  TOPICS: 'estudos-tracker-topics',
  SESSIONS: 'estudos-tracker-sessions',
  STUDY_PLAN: 'estudos-tracker-study-plan',
  GAMIFICATION: 'estudos-tracker-gamification',
  USER_SETTINGS: 'estudos-tracker-settings',
  TIMER_STATE: 'estudos-tracker-timer',
} as const;
```

### 3.2 Tipos de Dados (TypeScript)

#### 3.2.1 Tópico de Estudo

```typescript
// src/types/topic.ts
interface Topic {
  id: string;
  name: string;
  description: string;
  category: 'gramatica' | 'interpretacao' | 'redacao' | 'vocabulario' | 'literatura' | 'outro';
  priority: 'alta' | 'media' | 'baixa';
  status: 'nao_iniciado' | 'em_progresso' | 'dominado';
  progress: number; // 0-100
  targetHours: number; // horas mínimas para dominar
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

interface TopicStore {
  topics: Topic[];
  addTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  getTopicById: (id: string) => Topic | undefined;
}
```

#### 3.2.2 Sessão de Estudo

```typescript
// src/types/session.ts
interface StudySession {
  id: string;
  topicId: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  duration: number; // segundos
  points: number;
  notes?: string;
  createdAt: string;
}

interface SessionStore {
  sessions: StudySession[];
  activeSession: StudySession | null;
  startSession: (topicId: string) => void;
  endSession: (notes?: string) => void;
  getSessionsByTopic: (topicId: string) => StudySession[];
  getTotalTimeByTopic: (topicId: string) => number;
  getTodaySessions: () => StudySession[];
  getWeekSessions: () => StudySession[];
}
```

#### 3.2.3 Gamificação

```typescript
// src/types/achievement.ts
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
  unlockedAt?: string;
  progress?: number; // 0-100
}

interface AchievementCondition {
  type: 'streak' | 'total_hours' | 'sessions_count' | 'topics_mastered' | 'level';
  value: number;
}

interface UserLevel {
  level: number;
  title: string;
  currentPoints: number;
  pointsToNextLevel: number;
  totalPoints: number;
}

interface GamificationStore {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  achievements: Achievement[];
  userLevel: UserLevel;
  checkAndUnlockAchievements: () => void;
  addPoints: (points: number) => void;
  updateStreak: () => void;
}
```

#### 3.2.4 Plano de Estudos

```typescript
// src/types/study-plan.ts
interface StudyPlan {
  id: string;
  name: string;
  dailyGoalMinutes: number;
  weeklySchedule: WeeklySchedule;
  reminders: Reminder[];
  createdAt: string;
  updatedAt: string;
}

interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface DaySchedule {
  enabled: boolean;
  topics: string[]; // Topic IDs
  totalMinutes: number;
}

interface Reminder {
  id: string;
  time: string; // HH:mm
  enabled: boolean;
  daysOfWeek: number[]; // 0-6, Sunday = 0
}

interface StudyPlanStore {
  plan: StudyPlan | null;
  adherence: WeeklyAdherence;
  createPlan: (plan: Omit<StudyPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlan: (updates: Partial<StudyPlan>) => void;
  calculateAdherence: () => WeeklyAdherence;
}
```

### 3.3 Operações de Dados

```typescript
// src/lib/storage.ts
class LocalStorageService {
  // Generic methods
  static get<T>(key: string): T | null;
  static set<T>(key: string, value: T): void;
  static remove(key: string): void;
  static clear(): void;
  
  // Topic operations
  static getTopics(): Topic[];
  static saveTopics(topics: Topic[]): void;
  
  // Session operations
  static getSessions(): StudySession[];
  static saveSessions(sessions: StudySession[]): void;
  
  // Backup/Restore
  static exportData(): string;
  static importData(data: string): boolean;
}
```

---

## 4. Padrões de Implementação

### 4.1 Componentes React

#### Padrão: Componente Funcional + Hooks

```typescript
// Exemplo de componente seguindo o padrão
interface TopicCardProps {
  topic: Topic;
  onStartStudy: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TopicCard({ topic, onStartStudy, onEdit, onDelete }: TopicCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColor = useMemo(() => {
    switch (topic.status) {
      case 'dominado': return 'bg-green-500';
      case 'em_progresso': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  }, [topic.status]);
  
  return (
    <Card 
      className={cn('transition-all', isHovered && 'shadow-lg')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <CardTitle>{topic.name}</CardTitle>
        <Badge variant={topic.priority === 'alta' ? 'destructive' : 'default'}>
          {topic.priority}
        </Badge>
      </CardHeader>
      <CardContent>
        <Progress value={topic.progress} className={statusColor} />
      </CardContent>
      <CardFooter>
        <Button onClick={() => onStartStudy(topic.id)}>Estudar</Button>
        <Button variant="outline" onClick={() => onEdit(topic.id)}>Editar</Button>
        <Button variant="destructive" onClick={() => onDelete(topic.id)}>Excluir</Button>
      </CardFooter>
    </Card>
  );
}
```

### 4.2 Gerenciamento de Estado (Zustand)

#### Padrão: Store com Persistência

```typescript
// src/store/use-topic-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Topic } from '@/types/topic';

interface TopicState {
  topics: Topic[];
  isLoading: boolean;
  addTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
}

export const useTopicStore = create<TopicState>()(
  persist(
    (set, get) => ({
      topics: [],
      isLoading: false,
      
      addTopic: (topicData) => {
        const now = new Date().toISOString();
        const newTopic: Topic = {
          ...topicData,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ topics: [...state.topics, newTopic] }));
      },
      
      updateTopic: (id, updates) => {
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },
      
      deleteTopic: (id) => {
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: 'estudos-tracker-topics',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 4.3 Custom Hooks

#### useTimer Hook

```typescript
// src/components/hooks/use-timer.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  formattedTime: string;
}

export function useTimer(): UseTimerReturn {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);
  
  const formattedTime = useCallback(() => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [seconds]);
  
  return {
    seconds,
    isRunning,
    start: () => setIsRunning(true),
    pause: () => setIsRunning(false),
    resume: () => setIsRunning(true),
    stop: () => setIsRunning(false),
    reset: () => { setIsRunning(false); setSeconds(0); },
    formattedTime: formattedTime(),
  };
}
```

### 4.4 Padrão de Componentes UI (shadcn/ui)

Todos os componentes seguirão a estrutura do shadcn/ui:

```typescript
// Estrutura padrão de componente shadcn/ui
import { cn } from '@/lib/utils';

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Component({ className, variant = 'default', size = 'md', ...props }: ComponentProps) {
  return (
    <div
      className={cn(
        'base-styles',
        {
          'variant-default': variant === 'default',
          'variant-outline': variant === 'outline',
          'variant-ghost': variant === 'ghost',
        },
        {
          'size-sm': size === 'sm',
          'size-md': size === 'md',
          'size-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
```

### 4.5 Roteamento

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from '@/pages/dashboard';
import { Topics } from '@/pages/topics';
import { Timer } from '@/pages/timer';
import { StudyPlan } from '@/pages/study-plan';
import { Achievements } from '@/pages/achievements';
import { Settings } from '@/pages/settings';
import { Layout } from '@/components/layout/layout';

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/topics/:id" element={<Timer />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/study-plan" element={<StudyPlan />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
```

---

## 5. Configuração PWA

### 5.1 Manifesto PWA

```json
// public/manifest.json
{
  "name": "Estudos Tracker",
  "short_name": "Estudos",
  "description": "Aplicativo de gestão de estudos para preparação de concursos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8FAFC",
  "theme_color": "#2563EB",
  "orientation": "portrait-primary",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["education", "productivity"],
  "lang": "pt-BR",
  "dir": "ltr",
  "prefer_related_applications": false
}
```

### 5.2 Service Worker

```javascript
// public/service-worker.js
const CACHE_NAME = 'estudos-tracker-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response for caching
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request);
      })
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? { title: 'Estudos Tracker', body: 'Hora de estudar!' };
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: { url: data.url || '/' },
    })
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
```

### 5.3 Registro do Service Worker

```typescript
// src/lib/pwa.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available
                  console.log('New content available, refresh to update.');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    });
  }
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.resolve('denied' as NotificationPermission);
  }
  
  return Notification.requestPermission();
}

export function showLocalNotification(title: string, body: string, icon?: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon });
  }
}
```

---

## 6. Mapeamento de Épicos para Arquitetura

### 6.1 Epic 1: Gestão de Matérias e Organização

| User Story | Componente | Store | Página |
|------------|------------|-------|--------|
| US-001: Criar Novo Tópico | `topic-form.tsx` | `useTopicStore` | `/topics` |
| US-002: Categorizar Tópicos | `topic-card.tsx` | `useTopicStore` | `/topics` |
| US-003: Definir Prioridade | `topic-card.tsx`, `badge.tsx` | `useTopicStore` | `/topics` |
| US-004: Editar Tópico | `topic-form.tsx` (edit mode) | `useTopicStore` | `/topics` |
| US-005: Excluir Tópico | `confirm-dialog.tsx` | `useTopicStore` | `/topics` |

**Dependências Técnicas:**
- Types: `src/types/topic.ts`
- Store: `src/store/use-topic-store.ts`
- Componentes: shadcn/ui `Dialog`, `Form`, `Select`, `Input`

### 6.2 Epic 2: Sistema de Registro de Tempo

| User Story | Componente | Store | Página |
|------------|------------|-------|--------|
| US-006: Iniciar Cronômetro | `timer.tsx`, `timer-display.tsx` | `useSessionStore` | `/timer` |
| US-007: Pausar e Salvar | `timer-controls.tsx` | `useSessionStore` | `/timer` |
| US-008: Histórico de Sessões | `session-history.tsx` | `useSessionStore` | `/topics/:id` |
| US-009: Calcular Total de Horas | `stats-card.tsx` | `useSessionStore` | `/dashboard` |

**Dependências Técnicas:**
- Types: `src/types/session.ts`
- Store: `src/store/use-session-store.ts`
- Hook: `src/components/hooks/use-timer.ts`
- Componentes: shadcn/ui `Button`, `Progress`, `Card`

### 6.3 Epic 3: Acompanhamento de Progresso

| User Story | Componente | Store | Página |
|------------|------------|-------|--------|
| US-010: Calcular Progresso Percentual | `progress-chart.tsx`, `progress-bar.tsx` | `useTopicStore` | `/dashboard` |
| US-011: Definir Status de Domínio | `topic-card.tsx`, `status-badge.tsx` | `useTopicStore` | `/topics` |
| US-012: Evolução Histórica | `progress-chart.tsx` | `useSessionStore` | `/dashboard` |

**Dependências Técnicas:**
- Biblioteca: `recharts` para gráficos
- Tipos: `Topic.status`, `Topic.progress`
- Componentes: shadcn/ui `Progress`, custom charts

### 6.4 Epic 4: Plano de Estudos

| User Story | Componente | Store | Página |
|------------|------------|-------|--------|
| US-013: Criar Cronograma Semanal | `weekly-calendar.tsx` | `useStudyPlanStore` | `/study-plan` |
| US-014: Definir Metas Diárias | `daily-goal.tsx`, `goal-progress.tsx` | `useStudyPlanStore` | `/study-plan` |
| US-015: Configurar Lembretes | `reminder-config.tsx` | `useStudyPlanStore`, PWA Notifications | `/study-plan` |
| US-016: Acompanhar Adesão | `adherence-chart.tsx` | `useStudyPlanStore` | `/study-plan` |

**Dependências Técnicas:**
- Types: `src/types/study-plan.ts`
- Store: `src/store/use-study-plan-store.ts`
- API: Push Notifications, Web Notifications
- Componentes: shadcn/ui `Tabs`, custom calendar

### 6.5 Epic 5: Sistema de Gamificação

| User Story | Componente | Store | Página |
|------------|------------|-------|--------|
| US-017: Acumular Pontos | `points-counter.tsx`, `points-animation.tsx` | `useGamificationStore` | Global |
| US-018: Manter Sequência (Streak) | `streak-display.tsx`, `streak-calendar.tsx` | `useGamificationStore` | `/dashboard` |
| US-019: Desbloquear Conquistas | `achievement-badge.tsx`, `achievement-toast.tsx` | `useGamificationStore` | `/achievements` |
| US-020: Progressão de Níveis | `level-display.tsx`, `level-up-modal.tsx` | `useGamificationStore` | `/achievements` |

**Dependências Técnicas:**
- Types: `src/types/achievement.ts`
- Store: `src/store/use-gamification-store.ts`
- Biblioteca: `framer-motion` para animações
- Biblioteca: `react-hot-toast` para notificações de conquistas
- Componentes: shadcn/ui `Badge`, `Dialog`, custom badges

### 6.6 Epic 6: Dashboard e Visualização

| User Story | Componente | Store | Página |
|------------|------------|-------|--------|
| US-021: Total de Horas | `stats-card.tsx`, `total-time-display.tsx` | `useSessionStore` | `/dashboard` |
| US-022: Progresso Geral | `progress-overview.tsx`, `pie-chart.tsx` | `useTopicStore`, `useSessionStore` | `/dashboard` |
| US-023: Matérias Mais Estudadas | `top-topics-list.tsx` | `useSessionStore` | `/dashboard` |
| US-024: Streak Atual | `streak-display.tsx` | `useGamificationStore` | `/dashboard` |

**Dependências Técnicas:**
- Stores combinadas: `useTopicStore`, `useSessionStore`, `useGamificationStore`
- Biblioteca: `recharts` para visualizações
- Layout: Grid responsivo de cards

---

## 7. Configuração de Build e Deploy

### 7.1 Configuração Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor-utils': ['date-fns', 'clsx', 'uuid'],
        },
      },
    },
  },
});
```

### 7.2 Configuração Tailwind

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#0F172A',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

---

## 8. Considerações de Segurança

### 8.1 Local Storage

- **Limitação:** Local Storage é vulnerável a XSS (Cross-Site Scripting)
- **Mitigação:** Sanitizar todas as entradas de dados
- **Backup:** Implementar export/import de dados

### 8.2 Dados Sensíveis

- O app não armazena dados pessoais sensenciais
- Não há autenticação no MVP (dados locais apenas)
- Considerar criptografia para versões futuras

---

## 9. Testes

### 9.1 Estratégia de Testes

| Tipo | Ferramenta | Cobertura Alvo |
|------|------------|----------------|
| Unitário | Vitest | 70% |
| Componente | React Testing Library | 50% |
| E2E | Playwright | Fluxos principais |

### 9.2 Testes Unitários Exemplo

```typescript
// src/lib/__tests__/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageService } from '../storage';

describe('LocalStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  it('should save and retrieve topics', () => {
    const topic = { id: '1', name: 'Gramática', category: 'gramatica' as const, priority: 'alta' as const };
    LocalStorageService.set('test-topics', [topic]);
    const result = LocalStorageService.get('test-topics');
    expect(result).toEqual([topic]);
  });
});
```

---

## 10. Roadmap Técnico

### Fase 1: MVP (Sprint 1-5)
- [x] Setup projeto React + Vite + TypeScript
- [x] Configuração shadcn/ui + Tailwind
- [x] Schema Local Storage
- [x] Stores Zustand com persistência
- [x] Epic 1-6 implementação básica
- [x] PWA básico (manifest + service worker)
- [x] Deploy static hosting

### Fase 2: Melhorias (Post-MVP)
- [ ] Sistema de revisão espaçada (algoritmo)
- [ ] Banco de questões
- [ ] Simulados cronometrados
- [ ] Integração com calendário
- [ ] Cloud sync (Firebase/Supabase)

### Fase 3: Expansão (Futuro)
- [ ] App mobile nativo (React Native)
- [ ] IA para recomendações
- [ ] Conteúdo premium
- [ ] Modo offline completo

---

## Referências

| Documento | Caminho |
|-----------|---------|
| PRD | `docs/PRD.md` |
| Epic & Story Breakdown | `docs/epic-story-breakdown.md` |
| Especificação UX | `docs/ux-design-specification.md` |
| Configuração BMad | `bmad/bmm/config.yaml` |

---

## Glossário Técnico

| Termo | Definição |
|-------|-----------|
| PWA | Progressive Web App - Aplicação web que se comporta como app nativo |
| Service Worker | Script executado em background para funcionalidades offline |
| Local Storage | API de armazenamento key-value no navegador |
| Zustand | Biblioteca de gerenciamento de estado React |
| shadcn/ui | Coleção de componentes UI reutilizáveis |
| WCAG | Web Content Accessibility Guidelines |

---

**Próximos Passos:**
1. Solutioning Gate Check
2. Sprint Planning
3. Início da implementação do Sprint 1

---

_Documento de Arquitetura Técnica - Estudos Tracker v1.0_

_Criado através do BMad Method - Architecture Workflow_
