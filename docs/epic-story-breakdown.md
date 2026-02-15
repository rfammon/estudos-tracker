# Estudos Tracker - Decomposição em Epics e User Stories

**Projeto:** Estudos Tracker  
**Autor:** Ammon (Product Manager)  
**Data:** 2026-02-14  
**Versão:** 1.0  
**Idioma:** Português Brasil

---

## Visão Geral

Este documento detalha a decomposição dos requisitos funcionais do Estudos Tracker em **Epics** e **User Stories**, seguindo a metodologia ágil de desenvolvimento de software. Cada Epic representa uma funcionalidade principal do produto, enquanto as User Stories descrevem funcionalidades específicas e testáveis do ponto de vista do usuário.

### Requisitos Funcionais de Referência

| Código | Requisito | Epic Associado |
|--------|-----------|----------------|
| FR-001 | Gestão de Matérias | Epic 1 |
| FR-002 | Registro de Tempo | Epic 2 |
| FR-003 | Acompanhamento de Progresso | Epic 3 |
| FR-004 | Plano de Estudos | Epic 4 |
| FR-005 | Gamificação | Epic 5 |
| FR-006 | Dashboard | Epic 6 |

---

## Epic 1: Gestão de Matérias e Organização de Estudos

**Descrição:** Permitir ao usuário organizar seus estudos através da criação, edição e organização de matérias/tópicos de estudo por categoria e prioridade.

**Objetivo de Negócio:** Garantir que o usuário possa estruturar sua preparação de forma organizada, focando primeiro nas áreas mais importantes.

**Critérios de Aceitação do Epic:**
- [ ] Usuário pode criar tópicos com nome e descrição
- [ ] Usuário pode categorizar por tipo (Gramática, Interpretação, Redação, etc.)
- [ ] Usuário pode definir prioridade (Alta, Média, Baixa)
- [ ] Usuário pode editar tópicos existentes
- [ ] Usuário pode excluir tópicos
- [ ] Lista de tópicos é persistida localmente

### User Stories do Epic 1

#### US-001: Criar Novo Tópico de Estudo
**Como** concurseiro,  
**Eu quero** criar um novo tópico de estudo com nome e descrição,  
**Para** organizar minha preparação para concursos.

**Critérios de Aceitação:**
- [ ] Campo de nome é obrigatório (mínimo 3 caracteres)
- [ ] Campo de descrição é opcional
- [ ] Sistema mostra feedback de sucesso após criação
- [ ] Novo tópico aparece na lista imediatamente
- [ ] Dados são salvos no armazenamento local

**Estimativa:** 2 pontos de história

---

#### US-002: Categorizar Tópicos por Tipo
**Como** concurseiro,  
**Eu quero** categorizar meus tópicos por tipo de conteúdo,  
**Para** organizar melhor meus estudos por área do conhecimento.

**Critérios de Aceitação:**
- [ ] Opções de categoria disponíveis: Gramática, Interpretação de Texto, Redação, Vocabulário, Literatura, Outro
- [ ] Usuário pode selecionar uma categoria ao criar o tópico
- [ ] Filtro por categoria disponível na lista de tópicos
- [ ] Categoria é exibida visivelmente na interface

**Dependências:** US-001

**Estimativa:** 1 ponto de história

---

#### US-003: Definir Prioridade de Estudo
**Como** concurseiro,  
**Eu quero** definir a prioridade de cada tópico,  
**Para** focar primeiro no que é mais importante para minha preparação.

**Critérios de Aceitação:**
- [ ] Opções de prioridade: Alta, Média, Baixa
- [ ] Usuário pode alterar prioridade a qualquer momento
- [ ] Tarefas de alta prioridade são highlightadas visualmente
- [ ] Ordenação por prioridade disponível

**Dependências:** US-001

**Estimativa:** 1 ponto de história

---

#### US-004: Editar Tópico Existente
**Como** concurseiro,  
**Eu quero** editar as informações de um tópico existente,  
**Para** corrigir erros ou atualizar informações.

**Critérios de Aceitação:**
- [ ] Botão de edição visível em cada tópico
- [ ] Modal ou tela de edição abre com dados atuais
- [ ] Campos editáveis: nome, descrição, categoria, prioridade
- [ ] Botão salvar persiste as alterações
- [ ] Botão cancelar descarta as alterações

**Dependências:** US-001

**Estimativa:** 1 ponto de história

---

#### US-005: Excluir Tópico de Estudo
**Como** concurseiro,  
**Eu quero** excluir um tópico de estudo,  
**Para** remover tópicos que não são mais relevantes.

**Critérios de Aceitação:**
- [ ] Botão de exclusão visível em cada tópico
- [ ] Confirmação solicitada antes da exclusão
- [ ] Usuário pode confirmar ou cancelar
- [ ] Tópico removido da lista após confirmação
- [ ] Histórico de tempo associado também é removido

**Dependências:** US-001

**Estimativa:** 1 ponto de história

---

## Epic 2: Sistema de Registro de Tempo

**Descrição:** Permitir ao usuário registrar o tempo dedicado a cada matéria através de um cronômetro integrado, com salvamento automático e histórico de sessões.

**Objetivo de Negócio:** Garantir que o usuário tenha controle sobre seu tempo de estudo e possa visualizar onde está investindo seus esforços.

**Critérios de Aceitação do Epic:**
- [ ] Cronômetro funcional com iniciar/parar
- [ ] Tempo salvo automaticamente a cada pausa
- [ ] Histórico de sessões visível por tópico
- [ ] Total de horas calculado por matéria
- [ ] Interface mostra tempo atual durante estudo

### User Stories do Epic 2

#### US-006: Iniciar Cronômetro de Estudo
**Como** concurseiro,  
**Eu quero** iniciar um cronômetro ao começar a estudar um tópico,  
**Para** registrar o tempo dedicado.

**Critérios de Aceitação:**
- [ ] Botão iniciar disponível na interface do tópico
- [ ] Timer começa a contar a partir de 00:00:00
- [ ] Interface mostra tempo transcorrido em tempo real
- [ ] Cronômetro continua mesmo mudando de tela
- [ ] Animação indica que timer está ativo

**Dependências:** Epic 1 completo

**Estimativa:** 3 pontos de história

---

#### US-007: Pausar e Salvar Tempo de Estudo
**Como** concurseiro,  
**Eu quero** pausar o cronômetro e salvar o tempo estudado,  
**Para** registrar minha sessão de estudo.

**Critérios de Aceitação:**
- [ ] Botão pausar disponível durante cronômetro ativo
- [ ] Tempo é salvo automaticamente ao pausar
- [ ] Feedback visual de tempo salvo com sucesso
- [ ] Sessão aparece no histórico imediatamente
- [ ] Tempo total do tópico é atualizado

**Dependências:** US-006

**Estimativa:** 2 pontos de história

---

#### US-008: Visualizar Histórico de Sessões
**Como** concurseiro,  
**Eu quero** ver o histórico de minhas sessões de estudo,  
**Para** analisar minha rotina de estudos.

**Critérios de Aceitação:**
- [ ] Lista de sessões ordenadas por data (mais recente primeiro)
- [ ] Cada sessão mostra: data, hora de início, duração
- [ ] Total de sessões visível
- [ ] Filtro por período disponível (semana, mês, todos)
- [ ] É possível excluir sessões individuais

**Dependências:** US-007

**Estimativa:** 2 pontos de história

---

#### US-009: Calcular Total de Horas por Matéria
**Como** concurseiro,  
**Eu quero** ver o total de horas dedicadas a cada matéria,  
**Para** entender minha distribuição de tempo.

**Critérios de Aceitação:**
- [ ] Total de horas exibido por tópico
- [ ] Total formatado em horas e minutos (ex: 12h 30min)
- [ ] Ordenação por tempo total disponível
- [ ] Total geral de todas as matérias calculado
- [ ] Atualizado em tempo real após cada sessão

**Dependências:** US-007, US-008

**Estimativa:** 1 ponto de história

---

## Epic 3: Acompanhamento de Progresso

**Descrição:** Visualizar o progresso em cada tópico através de indicadores visuais, status de domínio e histórico de evolução.

**Objetivo de Negócio:** Motivar o usuário mostrando progresso tangível e visibilidade do caminho da "estaca zero" até a aprovação.

**Critérios de Aceitação do Epic:**
- [ ] Progresso percentual calculado e exibido por tópico
- [ ] Indicadores visuais (barras, círculos)
- [ ] Status: Não iniciado, Em progresso, Dominado
- [ ] Histórico de evolução ao longo do tempo

### User Stories do Epic 3

#### US-010: Calcular Progresso Percentual
**Como** concurseiro,  
**Eu quero** ver o percentual de progresso de cada tópico,  
**Para** saber quanto falta para dominar o conteúdo.

**Critérios de Aceitação:**
- [ ] Percentual calculado baseado em tempo mínimo esperado
- [ ] Barra de progresso visual de 0% a 100%
- [ ] Texto showing percentage next to bar
- [ ] Atualizado automaticamente com novas sessões
- [ ] Cor muda conforme o progresso (vermelho → amarelo → verde)

**Dependências:** Epic 2 completo

**Estimativa:** 2 pontos de história

---

#### US-011: Definir Status de Domínio
**Como** concurseiro,  
**Eu quero** marcar o status de cada tópico,  
**Para** ter uma visão clara do que já domino.

**Critérios de Aceitação:**
- [ ] Três statuses: Não iniciado, Em progresso, Dominado
- [ ] Usuário pode alterar status manualmente
- [ ] Status Dominado requer mínimo de horas definidas
- [ ] Ícones visuais para cada status
- [ ] Filtro por status disponível

**Dependências:** US-010

**Estimativa:** 1 ponto de história

---

#### US-012: Visualizar Evolução Histórica
**Como** concurseiro,  
**Eu quero** ver meu histórico de evolução ao longo do tempo,  
**Para** verificar meu progresso desde o início.

**Critérios de Aceitação:**
- [ ] Gráfico de linha mostrando progresso temporal
- [ ] Período configurável (semana, mês, todo o período)
- [ ] Comparação com período anterior
- [ ] Milestones de progresso destacados
- [ ] Dados exportáveis (opcional)

**Dependências:** US-010

**Estimativa:** 3 pontos de história

---

## Epic 4: Plano de Estudos

**Descrição:** Criar e seguir um plano de estudos estruturado com cronograma semanal, metas diárias e lembretes.

**Objetivo de Negócio:** Garantir que o usuário mantenha uma rotina de estudos consistente e alcance suas metas de preparação.

**Critérios de Aceitação do Epic:**
- [ ] Criação de cronograma semanal
- [ ] Definição de metas diárias
- [ ] Lembretes configuráveis
- [ ] Acompanhamento de adherence (adesão)

### User Stories do Epic 4

#### US-013: Criar Cronograma Semanal
**Como** concurseiro,  
**Eu quero** criar um cronograma semanal de estudos,  
**Para** organizar minha rotina de preparação.

**Critérios de Aceitação:**
- [ ] Grade semanal (segunda a domingo)
- [ ] multiple topics can be assigned per day
- [ ] Duração estimada por sessão configurável
- [ ] Visualização em formato calendário
- [ ] Editar/agendar dias específicos

**Dependências:** Epic 1 completo

**Estimativa:** 5 pontos de história

---

#### US-014: Definir Metas Diárias
**Como** concurseiro,  
**Eu quero** definir metas de estudo diárias,  
**Para** ter objetivos claros todos os dias.

**Critérios de Aceitação:**
- [ ] Meta de tempo diário (ex: 4 horas)
- [ ] Meta de tópicos estudados
- [ ] Progresso da meta visível no dashboard
- [ ] Notificação ao atingir meta
- [ ] Histórico de metas cumpridas

**Dependências:** US-013

**Estimativa:** 2 pontos de história

---

#### US-015: Configurar Lembretes de Estudo
**Como** concurseiro,  
**Eu quero** receber lembretes para estudar,  
**Para** manter minha rotina de estudos.

**Critérios de Aceitação:**
- [ ] Definir horário(s) de lembrete
- [ ] Notificações no navegador (Push API)
- [ ] Ativar/desativar lembretes
- [ ] Sons de notificação opcionais
- [ ] Lembretes configuráveis por dia da semana

**Dependências:** US-013

**Estimativa:** 3 pontos de história

---

#### US-016: Acompanhar Adesão ao Plano
**Como** concurseiro,  
**Eu quero** ver minha taxa de adesão ao plano de estudos,  
**Para** avaliar minha disciplina e consistency.

**Critérios de Aceitação:**
- [ ] Percentual de dias cumpridos vs. planejados
- [ ] Histórico semanal/mensal de adesão
- [ ] Dias em que meta não foi atingida destacados
- [ ] Comparação com semanas anteriores
- [ ] Incentivo visual para boas sequências

**Dependências:** US-014

**Estimativa:** 2 pontos de história

---

## Epic 5: Sistema de Gamificação

**Descrição:** Motivar o usuário através de elementos de jogo como pontos, conquistas, streaks e níveis.

**Objetivo de Negócio:** Manter o usuário engajado e motivado através de feedback positivo e recompensas por seu esforço.

**Critérios de Aceitação do Epic:**
- [ ] Sistema de pontos por tempo estudado
- [ ] Streak de dias consecutivos
- [ ] Conquistas por marcos alcançados
- [ ] Níveis de usuário

### User Stories do Epic 5

#### US-017: Acumular Pontos por Tempo Estudado
**Como** concurseiro,  
**Eu quero** ganhar pontos por cada minuto de estudo,  
**Para** ser recompensado por meu esforço.

**Critérios de Aceitação:**
- [ ] 1 ponto por minuto estudado
- [ ] Pontos acumulados visíveis no perfil
- [ ] Animação de pontos ganhos ao salvar sessão
- [ ] Ranking opcional de pontos (futuro)
- [ ] Pontos podem ser resgatados (futuro)

**Dependências:** Epic 2 completo

**Estimativa:** 2 pontos de história

---

#### US-018: Manter Sequência de Dias (Streak)
**Como** concurseiro,  
**Eu quero** manter uma sequência de dias estudando,  
**Para** me sentir motivado a não quebrar minha rotina.

**Critérios de Aceitação:**
- [ ] Contador de dias consecutivos visível
- [ ] Streak aumenta ao estudar pelo menos 15 min/dia
- [ ] Streak zera se um dia for perdido
- [ ] Maior streak histórico registrado
- [ ] Notificação incentivando a manter streak

**Dependências:** US-017

**Estimativa:** 3 pontos de história

---

#### US-019: Desbloquear Conquistas
**Como** concurseiro,  
**Eu quero** desbloquear conquistas por marcos alcançados,  
**Para** sentir que estou evoluindo e sendo reconhecido.

**Critérios de Aceitação:**
- [ ] Conquistas predefinidas (ex: "Primeiro estudo", "7 dias consecutivos", "100 horas")
- [ ] Badge visual para cada conquista
- [ ] Toast de celebração ao desbloquear
- [ ] Lista de conquistas (desbloqueadas e travadas)
- [ ] Progresso visível para próximas conquistas

**Dependências:** US-018

**Estimativa:** 3 pontos de história

---

#### US-020: Progressão de Níveis
**Como** concurseiro,  
**Eu quero** subir de nível conforme acumulo pontos,  
**Para** ter uma meta de longo prazo.

**Critérios de Aceitação:**
- [ ] Níveis baseados em pontos totais (ex: 0-1000 = iniciante, 1000-5000 = avançado)
- [ ] Título do nível visível no perfil
- [ ] Próximo nível e pontos necessários mostrados
- [ ] Celebração ao subir de nível
- [ ] 5-10 níveis definidos

**Dependências:** US-017

**Estimativa:** 2 pontos de história

---

## Epic 6: Dashboard e Visualização

**Descrição:** Exibir uma visão geral do progresso do usuário com estatísticas, métricas principais e informações motivacionais.

**Objetivo de Negócio:** Proporcionar ao usuário uma visão clara e motivadora de seu progresso geral.

**Critérios de Aceitação do Epic:**
- [ ] Total de horas estudadas
- [ ] Progresso geral
- [ ] Matérias mais estudadas
- [ ] Streak atual

### User Stories do Epic 6

#### US-021: Visualizar Total de Horas Estudadas
**Como** concurseiro,  
**Eu quero** ver o total de horas que estudei,  
**Para** avaliar meu esforço total.

**Critérios de Aceitação:**
- [ ] Total em horas exibido em destaque
- [ ] Quebra por período (semana, mês, total)
- [ ] Evolução comparada com período anterior
- [ ] Dado principal do dashboard

**Dependências:** Epic 2 completo

**Estimativa:** 1 ponto de história

---

#### US-022: Ver Progresso Geral
**Como** concurseiro,  
**Eu quero** ver meu progresso geral no app,  
**Para** entender onde estou na minha preparação.

**Critérios de Aceitação:**
- [ ] Percentual geral de progresso
- [ ] Tópicos Dominados / Total de tópicos
- [ ] Progresso médio por tópico
- [ ] Gráfico de pizza ou rosca visual

**Dependências:** Epic 3 completo

**Estimativa:** 2 pontos de história

---

#### US-023: Listar Matérias Mais Estudadas
**Como** concurseiro,  
**Eu quero** ver quais matérias dediquei mais tempo,  
**Para** identificar onde estou focando mais.

**Critérios de Aceitação:**
- [ ] Lista ordenada por tempo total
- [ ] Tempo e percentual do total shown
- [ ] Máximo de 5-10 itens
- [ ] Rápida identificação visual

**Dependências:** US-009

**Estimativa:** 1 ponto de história

---

#### US-024: Exibir Streak Atual
**Como** concurseiro,  
**Eu quiero** ver minha sequência atual de dias,  
**Para** me sentir motivado a continuar.

**Critérios de Aceitação:**
- [ ] Número de dias consecutivos em destaque
- [ ] Ícone ou visual de fogo/streak
- [ ] Maior streak histórico
- [ ] Dias restantes para próxima conquista

**Dependências:** US-018

**Estimativa:** 1 ponto de história

---

## Matriz de Priorização

| Prioridade | Epic | Pontos | Justificativa |
|------------|------|--------|---------------|
| 1 | Epic 1: Gestão de Matérias | 6 | Fundamentais para usar o app |
| 2 | Epic 2: Registro de Tempo | 8 | Funcionalidade core |
| 3 | Epic 3: Progresso | 6 | Motivação do usuário |
| 4 | Epic 6: Dashboard | 5 | Visibilidade do progresso |
| 5 | Epic 5: Gamificação | 10 | Engajamento |
| 6 | Epic 4: Plano de Estudos | 12 | Estruturação da rotina |

**Total de Pontos:** 47

---

## Dependências entre Epics

```
Epic 1 (Gestão de Matérias)
    ↓
Epic 2 (Registro de Tempo) ← Epic 3 (Progresso)
    ↓                        ↓
Epic 5 (Gamificação) ← Epic 6 (Dashboard)
    ↓
Epic 4 (Plano de Estudos)
```

---

## Sugestão de Sprints

### Sprint 1: Foundation (13 pontos)
- Epic 1 completo (6 pontos)
- US-006, US-007 (5 pontos)
- US-021 (2 pontos)

### Sprint 2: Core Features (11 pontos)
- US-008, US-009 (3 pontos)
- Epic 3 completo (6 pontos)
- US-022 (2 pontos)

### Sprint 3: Engagement (10 pontos)
- Epic 5 completo (10 pontos)

### Sprint 4: Planning (12 pontos)
- Epic 4 completo (12 pontos)

### Sprint 5: Polish (8 pontos)
- Epic 6 completo (US-023, US-024) (5 pontos)
- Ajustes e bugs (3 pontos)

---

## Critérios de Ready

Para uma User Story estar pronta para desenvolvimento:

1. **Critérios de Aceitação** definidos e testáveis
2. **Estimativa** atribuída
3. **Dependências** resolvidas
4. **Design** aprovado (se aplicável)
5. **Critérios de Aceitação do Epic** compreendidos

---

## Glossário

| Termo | Definição |
|-------|-----------|
| Epic | Conjunto de User Stories relacionadas a uma funcionalidade principal |
| User Story | Descrição curta de uma funcionalidade do ponto de vista do usuário |
| Sprint | Período de desenvolvimento (tipicamente 2 semanas) |
| MVP | Minimum Viable Product - versão mínima viável |
| Adesão | Percentual de metas cumpridas vs. planejadas |
| Streak | Sequência de dias consecutivos estudando |

---

## Referências

- PRD: `docs/PRD.md`
- Product Brief: `docs/product-brief.md`
- Workflow Status: `docs/bmm-workflow-status.yaml`

---

**Próximos Passos:**
1. Executar Workflow de UX Design (se necessário)
2. Executar Workflow de Arquitetura
3. Solutioning Gate Check
4. Sprint Planning

---

_Documento criado para o Estudos Tracker - Produto de gestão de estudos para preparação de concursos públicos_
