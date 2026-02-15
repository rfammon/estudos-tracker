# Estudos Tracker - Especificação de Design UX

_Criado em 2026-02-14 por Ammon_
_Gerado usando BMad Method - Create UX Design Workflow v1.0_

---

## Sumário Executivo

O Estudos Tracker é uma aplicação web progressiva (PWA) para gestão e rastreamento de estudos, voltada para candidatos a concursos públicos no Brasil. O aplicativo resolve o problema de concurseiros que têm dificuldade em manter uma rotina especializada de estudos, oferecendo um ambiente personalizado que motiva o usuário e permite acompanhar o progresso do zero ao bem preparado.

**Visão do Projeto:**
> Um aplicativo de estudos que transforma a preparação para concursos de algo abstrato e frustrante em um caminho claro e alcançável, combinando plano de estudos personalizado, design intuitivo e gamificação motivacional.

**Usuários Alvo:**
- Concurseiros (candidatos a concursos públicos)
- Estudantes de Português para concursos
- Profissionais que precisam melhorar Português para trabalho

**Plataforma:** Web App PWA (funcional offline, responsivo para desktop e mobile)

---

## 1. Fundações do Sistema de Design

### 1.1 Sistema de Design Escolhido

**Recomendação: shadcn/ui + Tailwind CSS**

**Justificativa:**
- shadcn/ui é um sistema de design moderno e altamente personalizável baseado em Tailwind CSS
- Excelente para aplicações web com foco em usabilidade e acessibilidade
- Componentes acessíveis por padrão (WCAG compliance)
- Totalmente customizável para criar uma identidade visual única
- Comunidades ativas e documentação excelente
- Perfeito para MVP com rápido desenvolvimento

**Componentes Fornecidos pelo Sistema:**
- Botões (Button), Campos de formulário (Input, Textarea, Select)
- Cards e Containers
- Diálogos e Modais
- Navegação (Tabs, Navigation Menu)
- Feedback (Toast, Alert, Badge)
- Formulários com validação
- Listas e Tables
- Dropdowns e Popovers

**Componentes Customizados Necessários:**
- Cronômetro de estudo (timer integrado)
- Barra de progresso animada
- Cards de matéria com status
- Sistema degamificação (badges, levels, streaks)
- Dashboard com gráficos
- Calendário de estudos

---

## 2. Experiência do Usuário Core

### 2.1 Experiência Definidora

**Ação Principal:** O usuário inicia o app e em 3 cliques pode começar a estudar um tópico enquanto um cronômetro conta o tempo.

**Elemento Diferenciador:**
O "Estudos Tracker" combina rastreamento de tempo com gamificação para criar um ciclo de motivação contínuo. Cada minuto estudado gera pontos, e marcos de progresso desbloqueiam conquistas.

**Experiência Central (One Thing):**
> "É o app onde você estuda com timer e fica motivado a manter uma sequência diária de estudos para alcançar seus objetivos de concurso."

### 2.2 Padrões UX Identificados

**Padrões Estabelecidos Utilizados:**
- CRUD de tópicos (Create, Read, Update, Delete)
- Dashboard analytics
- Autenticação simples (login local/sessão)
- Busca e filtro de conteúdo
- Criação de planos (forms multi-step)
- Feedback e notificações

**Padrões que Precisam de Atenção Especial:**
- **Cronômetro persistente**: Timer que continua mesmo ao mudar de tela (Service Worker)
- **Gamificação**: Sistema de pontos e conquistas com feedback visual
- **Streak tracking**: Sequência de dias com visual motivacional

---

## 3. Princíp Experiência Core

| Prios deincípio | Definição |
|-----------|-----------|
| **Velocidade** | Ações devem ser rápidas - máximo 3 cliques para iniciar estudo |
| **Orientação** | Interfaceguiada para novos usuários, com progressiva revelação de funcionalidades |
| **Flexibilidade** | Modo simples (iniciante) vs modo avançado (power user) |
| **Feedback** | Celebratório para conquistas, subtil para ações rotineiras |

---

## 4. Fundação Visual

### 4.1 Sistema de Cores

Para o Estudos Tracker, foram definidos 4 direcionamentos de tema baseados na personalidade do produto:

#### Tema 1: "Concurseiro Focado" (Recomendado)
**Personalidade:** Profissional, Confiável, Motivador

```
CORES PRINCIPAIS:
├── Primary:     #2563EB (Azul Royal - confiança, foco)
├── Secondary:   #0F172A (Azul escuro - autoridade)
└── Accent:      #F59E0B (Amarelo golden - sucesso, motivação)

CORES SEMÂNTICAS:
├── Success:     #10B981 (Green - progresso alcançado)
├── Warning:     #F59E0B (Amarelo - atenção)
├── Error:       #EF4444 (Vermelho - erro, alerta)
└── Info:        #3B82F6 (Azul claro - informação)

NEUTROS:
├── Background:  #F8FAFC (Cinza muito claro)
├── Surface:     #FFFFFF (Branco)
├── Border:      #E2E8F0 (Cinza claro)
└── Text:        #1E293B (Cinza escuro)
```

#### Tema 2: "Estudo Energético"
**Personalidade:** Energético, Divertido, Vibrante

```
├── Primary:     #7C3AED (Purple - criatividade, energia)
├── Secondary:   #EC4899 (Pink - entusiasmo)
└── Accent:      #F97316 (Orange - energia)
```

#### Tema 3: "Calma e Foco"
**Personalidade:** Calmo, Serenidade, Concentração

```
├── Primary:     #059669 (Green Emerald - crescimento)
├── Secondary:   #0D9488 (Teal - equilíbrio)
└── Accent:      #14B8A6 (Turquoise - renovação)
```

#### Tema 4: "Minimalista Clean"
**Personalidade:** Limpo, Moderno, Eficiente

```
├── Primary:     #18181B (Zinc preto)
├── Secondary:    #71717A (Zinc gray)
└── Accent:       #FFFFFF (Branco - contraste)
```

### 4.2 Sistema de Tipografia

**Fontes Recomendadas:**

| Uso | Fonte | Peso | Tamanho |
|-----|-------|------|---------|
| Headings (H1) | Inter | 700 (Bold) | 32px |
| Headings (H2) | Inter | 600 (Semibold) | 24px |
| Headings (H3) | Inter | 600 (Semibold) | 20px |
| Body | Inter | 400 (Regular) | 16px |
| Body Small | Inter | 400 (Regular) | 14px |
| Caption | Inter | 500 (Medium) | 12px |
| Timer/Stats | JetBrains Mono | 600 (Semibold) | 48px |

**Escala de Tipografia:**
- h1: 32px / 1.2 line-height
- h2: 24px / 1.3 line-height
- h3: 20px / 1.4 line-height
- body: 16px / 1.5 line-height
- small: 14px / 1.5 line-height
- caption: 12px / 1.4 line-height

### 4.3 Sistema de Espaçamento

**Base Unit:** 4px

**Escala de Espaçamento:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

**Breakpoints Responsivos:**
- Mobile: < 640px (1 coluna)
- Tablet: 640px - 1024px (2 colunas)
- Desktop: > 1024px (3-4 colunas, sidebar)

---

## 5. Direcionamento de Design

### 5.1 Abordagem de Design Escolhida

**Layout: Sidebar Navigation + Cards**
- Navegação lateral fixa à esquerda (desktop) / Bottom navigation (mobile)
- Conteúdo principal em cards organizados em grid
- Dashboard como página inicial

**Hierarquia Visual:**
- Densidade balanceada (espaço para respiração, mas rico em informações)
- Headers claros e prominententes
- Foco em dados e métricas visuais

**Padrões de Interação:**
- Workflows principal em modais para ações rápidas
- Expansão progressiva para configurações avançadas
- Drag-and-drop para reordenar prioridades

**Estilo Visual:**
- Visual weight: Equilibrado (estrutura clara, peso visual moderado)
- Profundidade: Sombras sutis para elevação (shadcn/ui default)
- Bordas: Subtis para separação de conteúdo

### 5.2 Estrutura de Navegação

```
┌─────────────────────────────────────────────────┐
│  SIDEBAR (Desktop) / BOTTOM NAV (Mobile)        │
├─────────────────────────────────────────────────┤
│  📊 Dashboard                                    │
│  📚 Matérias                                     │
│  ⏱️ Cronômetro                                   │
│  📅 Plano de Estudos                            │
│  🏆 Conquistas                                   │
│  ⚙️ Configurações                                │
└─────────────────────────────────────────────────┘
```

---

## 6. Fluxos de Usuário

### 6.1 Fluxo Principal: Iniciar Estudo

```
[Dashboard] → [Selecionar Matéria] → [Iniciar Timer] → [Pausar/Salvar]
     │                │                      │                   │
     └─> Verificar   └─> Ver detalhes   └─> Timer          └─> Feedback
         progresso       da matéria          ativo               visual
         geral           e iniciar                              (pontos,
                                                                streak)
```

**Passos do Fluxo:**

1. **Entrada:** Usuário acessa Dashboard
2. **Seleção:** Escolhe matéria da lista (cards)
3. **Ação:** Clica em "Iniciar Estudo"
4. **Timer:** Cronômetro começa a contar
5. **Pausa:** Usuário clica em "Pausar"
6. **Feedback:** Sistema salva tempo, calcula pontos, atualiza streak
7. **Sucesso:** Toast de confirmação, atualização do Dashboard

### 6.2 Fluxo: Criar Plano de Estudos

```
[Criar Plano] → [Definir Meta Diária] → [Criar Grade Semanal] → [Configurar Lembretes]
     │                │                        │                        │
     └─> Nome e   └─> Tempo/dia           └─> Associar           └─> Horários
         objetivo      e tópicos              matérias aos           de notificação
                                           dias da semana
```

### 6.3 Fluxo: Gamificação

```
[Estudar] → [Ganhar Pontos] → [Subir Nível] → [Desbloquear Conquistas]
     │            │               │              │
     └─> Tempo   └─> 1 ponto/   └─> Milestones │-> Marcos específicos
         acumulado   minuto          (1k, 5k,   └─> Badges visuais
                                      10k...)   └─> Celebração (toast)
```

---

## 7. Biblioteca de Componentes

### 7.1 Componentes do Sistema (shadcn/ui)

| Componente | Uso | Estados |
|------------|-----|---------|
| Button | Ações primárias (iniciar, salvar) | default, hover, active, disabled, loading |
| Card | Containers de conteúdo | default, hover, selected |
| Input | Campos de texto | default, focus, error, disabled |
| Select | Dropdowns | default, open, selected |
| Dialog | Modais de criação/edição | open, closing |
| Toast | Notificações | success, error, warning, info |
| Badge | Tags e indicadores | default, success, warning, error |
| Progress | Barras de progresso | determinate, indeterminate |
| Tabs | Navegação interna | active, inactive |
| Table | Listas de dados | default, sortable |

### 7.2 Componentes Customizados

#### Timer de Estudo
```
Props:
- isRunning: boolean
- elapsedTime: number (segundos)
- topicName: string
- onPause: () => void
- onResume: () => void
- onStop: () => void

Estados:
- Idle: Botão "Iniciar" visível
- Running: Timer counting, animation pulse
- Paused: Timer parado, botões "Continuar" e "Parar"
- Saving: Loading state, then success
```

#### Card de Matéria
```
Props:
- title: string
- category: 'gramatica' | 'interpretacao' | 'redacao' | 'vocabulario' | 'literatura'
- priority: 'alta' | 'media' | 'baixa'
- progress: number (0-100)
- status: 'nao_iniciado' | 'em_progresso' | 'dominado'
- totalTime: number (minutos)
- onStartStudy: () => void
- onEdit: () => void
- onDelete: () => void
```

#### Badge de Conquista
```
Props:
- title: string
- description: string
- icon: string
- isUnlocked: boolean
- progress?: number (0-100)
- unlockedAt?: Date
```

#### Card de Estatísticas (Dashboard)
```
Props:
- title: string
- value: string | number
- subtitle?: string
- icon: string
- trend?: 'up' | 'down' | 'neutral'
- trendValue?: string
- color?: 'primary' | 'success' | 'warning' | 'error'
```

---

## 8. Decisões de Padrões UX

### 8.1 Hierarquia de Botões

| Tipo | Estilo | Uso |
|------|--------|-----|
| Primário | Fundo azul (#2563EB), texto branco | Ações principais (Iniciar, Salvar, Criar) |
| Secundário | Borda azul, fundo transparente | Ações secundárias (Editar, Cancelar) |
| Terciário | Texto azul, sem borda | Links e ações menores (Ver mais) |
| Destrutivo | Fundo vermelho (#EF4444) | Excluir, sair |

### 8.2 Padrões de Feedback

| Tipo | Padrão | Quando usar |
|------|--------|-------------|
| Sucesso | Toast (notificação breve no canto superior direito) | Após salvar, criar, completar |
| Erro | Toast vermelho + mensagem inline no campo | Validação de formulário |
| Aviso | Toast amarelo | Lembretes,需要注意的内容 |
| Info | Toast azul | Informações gerais |
| Carregamento | Skeleton (estrutura cinza) | Carregamento de dados |

### 8.3 Padrões de Formulários

- **Posição do Label:** Acima do campo
- **Indicador de Obrigatório:** Asterisco vermelho
- **Validação:** On blur (ao sair do campo)
- **Erro:** Mensagem abaixo do campo em vermelho
- **Help text:** Texto cinza abaixo do campo em font smaller

### 8.4 Padrões de Modal

- **Tamanho:**sm (<400px), md (400-600px), lg (>600px), full (tela cheia mobile)
- **Fechamento:** Botão X no canto, clicar fora fecha, ESC fecha
- **Foco:** Auto-focus no primeiro campo editável
- **Scroll:** Scroll interno se conteúdo exceder altura

### 8.5 Padrões de Navegação

- **Estado Ativo:** Texto em negrito + cor primária + borda esquerda (desktop)
- **Breadcrumb:** Não necessário (app single-page)
- **Back Button:** Botão de voltar no header mobile
- **Deep Linking:** URLs significativas (/dashboard, /materias/1, /timer)

### 8.6 Estados Vazios

- **Primeiro uso:** Mensagem de boas-vindas + CTA para criar primeira matéria
- **Sem resultados:** "Nenhum resultado encontrado" + sugestão de filtros
- **Conteúdo limpo:** "Você não tem nada aqui ainda" + botão de criar

### 8.7 Padrões de Confirmação

- **Excluir:** Sempre confirmar com modal (destructive action)
- **Sair sem salvar:** Warn se houver dados não salvos
- **Ações irreversíveis:** Confirmação extra com typed text

### 8.8 Padrões de Notificação

- **Posição:** Canto superior direito (desktop), topo (mobile)
- **Duração:** 5 segundos (auto-dismiss), manual para erros
- **Stacking:** Máximo 3 visíveis, mais antigo sai
- **Prioridade:** Crítico (vermelho), Importante (amarelo), Info (azul)

### 8.9 Padrões de Busca

- **Trigger:** Manual (após digitar)
- **Resultados:** Instantâneo após ENTER
- **Filtros:** Sidebar ou dropdown acima dos resultados
- **Sem resultados:** Sugestões de busca ou mensagem helpful

### 8.10 Padrões de Data/Hora

- **Formato:** Relative (há 2 dias, hoje, ontem) + Absolute no hover
- **Picker:** Calendar dropdown para datas
- **Timezone:** Browser local

---

## 9. Design Responsivo e Acessibilidade

### 9.1 Estratégia Responsiva

**Breakpoints:**

| Breakpoint | Largura | Layout | Navegação |
|------------|---------|--------|------------|
| Mobile | < 640px | 1 coluna | Bottom nav (ícones) |
| Tablet | 640-1024px | 2 colunas | Sidebar colapsada |
| Desktop | > 1024px | 3-4 colunas | Sidebar expandida |

**Padrões de Adaptação:**
- **Navegação:** Sidebar vira bottom nav no mobile
- **Sidebar:** Colapsa para hamburger menu no tablet
- **Cards:** Grid 1 → 2 → 3 colunas conforme breakpoints
- **Modais:** Full-screen no mobile
- **Tabelas:** Scroll horizontal ou card view no mobile

### 9.2 Estratégia de Acessibilidade

**Nível WCAG Alvo:** WCAG 2.1 Level AA

**Requisitos de Acessibilidade:**

| Requisito | Implementação |
|-----------|---------------|
| Contraste de cor | Mínimo 4.5:1 para texto normal, 3:1 para texto grande |
| Navegação por teclado | Todos os elementos interativos acessíveis via Tab |
| Indicadores de foco | Outline visível (2px solid) em todos os elementos |
| Labels ARIA | Labels significativos para screen readers |
| Alt text | Descrição para todas as imagens significativas |
| Labels de formulário | Associações corretas label-input |
| Identificação de erros | Mensagens claras e descritivas |
| Tamanho de alvo | Mínimo 44x44px no mobile |

**Estratégia de Testes:**
- Automatizado: Lighthouse, axe DevTools
- Manual: Navegação apenas por teclado
- Screen reader: NVDA, VoiceOver

---

## 10. Telas Principais

### 10.1 Dashboard (Página Inicial)

```
┌─────────────────────────────────────────────────────┐
│ Estudos Tracker    [Streak: 🔥 7]    [User: 👤]     │
├─────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│ │   47h 30m   │ │    85%      │ │  🔥 7 dias   │  │
│ │ Total       │ │ Progresso    │ │ Streak       │  │
│ │ Estudado    │ │ Geral       │ │ Atual        │  │
│ └─────────────┘ └─────────────┘ └─────────────┘  │
│                                                     │
│ Matérias Recentes                                  │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│ │ Gramática   │ │ Interp.     │ │ Redação      │  │
│ │ ████░░ 60%  │ │ ██░░░░ 20%  │ │ ██████ 80%   │  │
│ │ 12h 30m     │ │ 4h 15m      │ │ 18h 45m      │  │
│ └─────────────┘ └─────────────┘ └─────────────┘  │
│                                                     │
│ [+ Criar Matéria]    [Ver Todas →]                │
└─────────────────────────────────────────────────────┘
```

### 10.2 Lista de Matérias

```
┌─────────────────────────────────────────────────────┐
│ ← Matérias           [+ Nova Matéria]    🔍        │
├─────────────────────────────────────────────────────┤
│ Filtros: [Todas ▼] [Ordenar: Recentes ▼]           │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 📚 Gramática                               🔥  ││
│ │ Regência Verbal e Concordância                 ││
│ │ Progresso: ████████░░ 80%  |  18h 45m         ││
│ │ [▶ Estudar]  [✏️]  [🗑️]                        ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ 📖 Interpretação de Texto                 🔥  ││
│ │ Técnicas de Leitura e Análise                 ││
│ │ Progresso: ████░░░░░ 40%  |  8h 20m           ││
│ │ [▶ Estudar]  [✏️]  [🗑️]                        ││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### 10.3 Cronômetro de Estudo

```
┌─────────────────────────────────────────────────────┐
│ ← Voltar                                            │
│                                                     │
│              Gramática                              │
│                                                     │
│           ┌───────────┐                            │
│           │  01:23:45 │  ← Timer em JetBrains     │
│           └───────────┘       Mono 48px            │
│                                                     │
│     ┌─────────────────────────────────────────┐    │
│     │         ████████████░░░░░░  75%        │    │
│     │         Meta: 2h | Atual: 1h 23m        │    │
│     └─────────────────────────────────────────┘    │
│                                                     │
│        ┌──────────┐    ┌──────────┐              │
│        │  ⏸️ Pause │    │  ⏹️ Parar  │              │
│        └──────────┘    └──────────┘              │
│                                                     │
│ [+ Adicionar Intervalo]                             │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ Sessão atual: 1h 23m 45s                       ││
│ │ Pontos ganhos: 83 🔸                           ││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### 10.4 Plano de Estudos

```
┌─────────────────────────────────────────────────────┐
│ ← Plano de Estudos        [+ Novo Plano]           │
├─────────────────────────────────────────────────────┤
│ Meta Diária: [4h]  │  Adesão: [████████░░ 80%]   │
│                                                     │
│ ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐       │
│ │ Seg │ Ter │ Qua │ Qui │ Sex │ Sáb │ Dom │       │
│ ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤       │
│ │ 📚  │ 📚  │ 📖  │ 📚  │ 📖  │ 📚  │ 💪  │       │
│ │ 1h  │ 1h  │ 30m │ 1h  │ 30m │ 1h  │     │       │
│ │     │     │     │     │     │     │     │       │
│ │ ✅  │ ✅  │ ✅  │ ⏳  │     │     │     │       │
│ └─────┴─────┴─────┴─────┴─────┴─────┴─────┘       │
│                                                     │
│ [+ Adicionar matéria ao dia]                        │
└─────────────────────────────────────────────────────┘
```

### 10.5 Conquistas

```
┌─────────────────────────────────────────────────────┐
│ ← Conquistas                   [Nível 5: Estudioso] │
├─────────────────────────────────────────────────────┤
│ ┌─────────────┐                                     │
│ │ 1,250 🔸    │  Próximo nível: 2,500 🔸 (50%)    │
│ │ Pontos      │  ████████████░░░░░░                 │
│ └─────────────┘                                     │
│                                                     │
│ Desbloqueadas (8/15)                                │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│ │ 🎯       │ │ 📅       │ │ ⏰       │ │  📚   │ │
│ │ Primeiro │ │ 7 dias   │ │ 100h     │ │        │ │
│ │ Estudo   │ │ seguidos │ │ estudadas│ │        │ │
│ └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│                                                     │
│ Bloqueadas                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ │  🔒 30d  │ │  🔒 500h │ │ 🔒 Nível10│            │
│ │streak    │ │          │ │          │            │
│ └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────┘
```

---

## 11. Resumo de Implementação

### O que foi definido:

| Categoria | Decisão |
|-----------|---------|
| **Design System** | shadcn/ui + Tailwind CSS |
| **Tema Visual** | "Concurseiro Focado" - Azul Royal (#2563EB) + Verde Sucesso |
| **Tipografia** | Inter (headings + body) + JetBrains Mono (timer) |
| **Layout** | Sidebar + Cards em Grid |
| **Navegação** | Bottom nav (mobile), Sidebar (desktop) |
| **Fluxos Principais** | Iniciar estudo, Criar plano, Gamificação |
| **Padrões UX** | Feedback toast, Validação on blur, Confirmação para delete |
| **Responsivo** | 3 breakpoints (mobile < 640px, tablet, desktop) |
| **Acessibilidade** | WCAG 2.1 Level AA |

### Próximos Passos:

1. Designers podem criar mockups de alta fidelidade a partir desta fundação
2. Desenvolvedores podem implementar com guidance UX clara
3. Todas as decisões de design estão documentadas com justificativa

---

## Apêndice

### Documentos Relacionados
- Product Requirements: `docs/PRD.md`
- Epic & Story Breakdown: `docs/epic-story-breakdown.md`
- Workflow Status: `docs/bmm-workflow-status.yaml`

### Entregáveis Interativos

Este documento de Especificação UX foi criado através de colaboração visual:
- **Color Theme Visualizer**: [ux-color-themes.html](./ux-color-themes.html)
  - HTML interativo mostrando todas as opções de tema exploradas
  - Exemplos de componentes UI em cada tema

- **Design Direction Mockups**: [ux-design-directions.html](./ux-design-directions.html)
  - HTML interativo com abordagens completas de design
  - Mockups de tela cheia com filosofia de design

---

| Data | Versão | Alterações | Autor |
|------|--------|------------|-------|
| 2026-02-14 | 1.0 | Especificação UX Inicial | Ammon |

---

_Esta Especificação de Design UX foi criada através de facilitação colaborativa de design, não geração por template. Todas as decisões foram tomadas com input do usuário e documentadas com justificativa._
