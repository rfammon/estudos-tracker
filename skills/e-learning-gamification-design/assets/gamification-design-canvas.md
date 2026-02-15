# Gamification Design Canvas

Use this template to plan and design gamification elements for your e-learning experience.

---

## Project Overview

| Attribute | Description |
|-----------|-------------|
| **Project Name** | [Name] |
| **Target Audience** | [Who are the learners?] |
| **Learning Goals** | [What should they achieve?] |
| **Platform** | [Where will this be implemented?] |
| **Timeline** | [Implementation date] |

---

## 1. Learner Motivation Analysis

### Target Player Types (Bartle's Taxonomy)

Rate the expected distribution of your learners:

| Player Type | Expected % | Priority | Rationale |
|-------------|------------|----------|-----------|
| **Achievers** | [%] | [H/M/L] | [Why they're motivated] |
| **Explorers** | [%] | [H/M/L] | [Why they're motivated] |
| **Socializers** | [%] | [H/M/L] | [Why they're motivated] |
| **Competitors** | [%] | [H/M/L] | [Why they're motivated] |

### Self-Determination Theory Analysis

| Need | Current State | Desired State | Gamification Opportunity |
|------|---------------|---------------|-------------------------|
| **Autonomy** | [How much control do learners have now?] | [How much should they have?] | [What elements can help?] |
| **Competence** | [How do learners feel about their skills?] | [How should they feel?] | [What elements can help?] |
| **Relatedness** | [How connected are learners?] | [How connected should they be?] | [What elements can help?] |

### Motivation Mapping

| Learner Segment | Primary Motivation | Secondary Motivation | Key Drivers |
|-----------------|-------------------|---------------------|-------------|
| [Segment 1] | [What drives them] | [Secondary driver] | [Specific triggers] |
| [Segment 2] | [What drives them] | [Secondary driver] | [Specific triggers] |
| [Segment 3] | [What drives them] | [Secondary driver] | [Specific triggers] |

---

## 2. Gamification Objectives

### Primary Objectives

| Objective | Current Metric | Target Metric | How Gamification Helps |
|-----------|---------------|---------------|------------------------|
| [e.g., Increase completion rate] | [Current %] | [Target %] | [Mechanism] |
| [e.g., Improve daily engagement] | [Current DAU] | [Target DAU] | [Mechanism] |
| [e.g., Enhance knowledge retention] | [Current score] | [Target score] | [Mechanism] |

### Success Criteria

| Metric | Baseline | Target | Measurement Method |
|--------|----------|--------|-------------------|
| [Metric 1] | [Value] | [Value] | [How measured] |
| [Metric 2] | [Value] | [Value] | [How measured] |
| [Metric 3] | [Value] | [Value] | [How measured] |

---

## 3. Core Gamification Elements

### 3.1 Points System

| Attribute | Decision |
|-----------|----------|
| **Point Type** | [XP/Skill Points/Currency/Mixed] |
| **Earning Mechanism** | [How points are earned] |
| **Spending/Use** | [Can points be spent? On what?] |
| **Display** | [Where/how are points shown?] |
| **Decay/Reset** | [Do points ever reset?] |

**Point Values Table:**

| Action | Points | Frequency | Cap |
|--------|--------|-----------|-----|
| Complete lesson | [X] | Per lesson | [Max/day] |
| Pass quiz | [X] | Per quiz | [Max/day] |
| Perfect score | [X] | Per quiz | [Max/day] |
| Streak bonus | [X] | Daily | [Max streak] |
| Help peer | [X] | Per action | [Max/day] |
| Complete module | [X] | Per module | None |
| Complete course | [X] | Per course | None |

### 3.2 Levels System

| Attribute | Decision |
|-----------|----------|
| **Level Type** | [Numbered/Named/Hybrid] |
| **Total Levels** | [Number] |
| **Progression Type** | [Linear/Exponential/Custom] |
| **Level Benefits** | [What unlocks at each level?] |

**Level Progression:**

| Level | Name | XP Required | Cumulative XP | Rewards/Unlocks |
|-------|------|-------------|---------------|-----------------|
| 1 | [Name] | 0 | 0 | [What they get] |
| 2 | [Name] | 100 | 100 | [What they get] |
| 3 | [Name] | 200 | 300 | [What they get] |
| 4 | [Name] | 400 | 700 | [What they get] |
| 5 | [Name] | 800 | 1500 | [What they get] |
| ... | ... | ... | ... | ... |
| [N] | [Name] | [XP] | [Total] | [What they get] |

**Progression Formula:**
```
XP for Level N = [Base XP] × [Multiplier]^(N-1)
```

### 3.3 Badges/Achievements

**Badge Categories:**

| Category | Purpose | Examples |
|----------|---------|----------|
| **Completion** | Finishing content | Course Complete, Module Master |
| **Mastery** | Demonstrating expertise | Perfect Score, Speed Demon |
| **Consistency** | Regular engagement | 7-Day Streak, Monthly Active |
| **Social** | Community contribution | Helper, Collaborator |
| **Exploration** | Discovery | Explorer, Easter Egg Hunter |
| **Special** | Unique achievements | Early Adopter, Beta Tester |

**Badge Design Template:**

| Badge ID | Name | Description | Icon | Trigger | XP | Rarity |
|----------|------|-------------|------|---------|-----|--------|
| B001 | [Name] | [Description] | [Emoji/Image] | [How earned] | [XP] | [Common/Rare/Epic] |
| B002 | [Name] | [Description] | [Emoji/Image] | [How earned] | [XP] | [Common/Rare/Epic] |
| B003 | [Name] | [Description] | [Emoji/Image] | [How earned] | [XP] | [Common/Rare/Epic] |

**Hidden Badges:**

| Badge ID | Name | Trigger | Discovery Hint |
|----------|------|---------|----------------|
| H001 | [Name] | [Secret trigger] | [How might they find it] |

### 3.4 Leaderboards

| Attribute | Decision |
|-----------|----------|
| **Scope** | [Global/Team/Personal] |
| **Time Frame** | [All-time/Weekly/Daily] |
| **Metric** | [XP/Completions/Streak/etc.] |
| **Visibility** | [Everyone/Friends/Self only] |
| **Anonymity** | [Real names/Anonymous] |

**Leaderboard Types:**

| Type | Description | Update Frequency | Reset Period |
|------|-------------|------------------|--------------|
| Global All-Time | Top performers overall | Real-time | Never |
| Weekly Challenge | This week's top learners | Daily | Weekly |
| Team Board | Team rankings | Real-time | Monthly |
| Personal Progress | Own improvement | Real-time | Never |

**Leaderboard Display:**

```
┌─────────────────────────────────────┐
│ 🏆 Weekly Leaderboard               │
├─────────────────────────────────────┤
│ 1. 🥇 [Name]           2,450 XP    │
│ 2. 🥈 [Name]           2,300 XP    │
│ 3. 🥉 [Name]           2,150 XP    │
│ 4. [Name]              2,000 XP    │
│ 5. [Name]              1,950 XP    │
│ ─────────────────────────────────── │
│ 23. YOU ⭐             1,200 XP    │
│     ↑ 3 positions from last week   │
└─────────────────────────────────────┘
```

### 3.5 Streaks

| Attribute | Decision |
|-----------|----------|
| **Streak Type** | [Daily login/Activity/Both] |
| **Activity Threshold** | [What counts as activity?] |
| **Streak Display** | [Where shown?] |
| **Streak Rewards** | [What bonuses for streaks?] |
| **Streak Protection** | [Can streaks be saved?] |

**Streak Milestones:**

| Days | Reward | Badge | Bonus XP |
|------|--------|-------|----------|
| 3 | [Reward] | [Badge] | [XP] |
| 7 | [Reward] | [Badge] | [XP] |
| 14 | [Reward] | [Badge] | [XP] |
| 30 | [Reward] | [Badge] | [XP] |
| 60 | [Reward] | [Badge] | [XP] |
| 100 | [Reward] | [Badge] | [XP] |
| 365 | [Reward] | [Badge] | [XP] |

### 3.6 Challenges

| Attribute | Decision |
|-----------|----------|
| **Challenge Types** | [Daily/Weekly/Special] |
| **Difficulty Levels** | [Easy/Medium/Hard] |
| **Rewards** | [XP/Badges/Unlockables] |
| **Time Limits** | [Duration] |

**Challenge Templates:**

| Challenge ID | Name | Description | Difficulty | Duration | Reward |
|--------------|------|-------------|------------|----------|--------|
| D001 | [Name] | [Description] | Easy | 1 day | [Reward] |
| W001 | [Name] | [Description] | Medium | 7 days | [Reward] |
| S001 | [Name] | [Description] | Hard | 30 days | [Reward] |

---

## 4. Progression Design

### Learning Path Integration

| Learning Stage | Gamification Focus | Key Elements |
|----------------|-------------------|--------------|
| **Onboarding** | Quick wins, early success | Welcome badge, first XP, tutorial completion |
| **Beginner** | Building habits | Daily streaks, easy challenges, first level |
| **Intermediate** | Skill development | Skill badges, moderate challenges, team features |
| **Advanced** | Mastery and leadership | Leaderboards, mentorship badges, special content |
| **Expert** | Community contribution | Helper badges, content creation, recognition |

### Unlock Mechanics

| Unlock Type | Trigger | What Unlocks |
|-------------|---------|--------------|
| **Content** | [Level/Completion] | [New modules/lessons] |
| **Features** | [Level/Achievement] | [New platform features] |
| **Customization** | [Achievement/Event] | [Avatar items/themes] |
| **Social** | [Level/Behavior] | [Forum access/Team features] |

---

## 5. Social Features

### Team/Group Design

| Attribute | Decision |
|-----------|----------|
| **Team Size** | [Min-Max members] |
| **Team Formation** | [Auto/Manual/Mixed] |
| **Team Goals** | [What do teams work toward?] |
| **Team Rewards** | [What do teams earn together?] |

### Social Interactions

| Interaction | Mechanism | Reward |
|-------------|-----------|--------|
| **Peer Help** | [Q&A, forums] | [Helper badge, XP] |
| **Collaboration** | [Group projects] | [Team badge, bonus XP] |
| **Competition** | [Challenges, leaderboards] | [Ranking, prizes] |
| **Sharing** | [Achievement sharing] | [Social badge, bonus] |

---

## 6. Feedback Design

### Feedback Loops

| Loop Type | Timing | Content | Channel |
|-----------|--------|---------|---------|
| **Immediate** | Real-time | Points, sounds, animations | In-app |
| **Session** | End of session | Summary, progress | In-app |
| **Daily** | Daily digest | Activity summary | Email/Push |
| **Weekly** | Weekly report | Progress, rankings | Email |
| **Milestone** | On achievement | Celebration | In-app + Notification |

### Notification Strategy

| Trigger | Channel | Message | Frequency Cap |
|---------|---------|---------|---------------|
| Streak at risk | Push | "Don't lose your 7-day streak!" | 1/day |
| New challenge | In-app | "New weekly challenge available!" | 1/week |
| Achievement | In-app + Push | "You earned [Badge Name]!" | No cap |
| Level up | In-app | "You reached Level [N]!" | No cap |
| Leaderboard change | In-app | "You moved up 3 positions!" | 1/day |

---

## 7. Economy Balance

### Point Economy

| Attribute | Value |
|-----------|-------|
| **Total XP Available** | [Sum of all possible XP] |
| **Average XP per Session** | [Expected earning rate] |
| **Time to Max Level** | [Estimated duration] |
| **Inflation Control** | [How to prevent point inflation] |

### Reward Balance Matrix

| Reward Type | Frequency | Value | Scarcity |
|-------------|-----------|-------|----------|
| Points | Every action | Low | Unlimited |
| Badges (Common) | Regular | Medium | Many available |
| Badges (Rare) | Occasional | High | Limited |
| Badges (Epic) | Rare | Very High | Very limited |
| Unlocks | Milestones | Variable | Fixed |

---

## 8. Implementation Plan

### Phase 1: Foundation (MVP)

| Element | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| Points system | High | Medium | None |
| Progress bars | High | Low | None |
| Basic badges | High | Medium | Points system |
| Level system | Medium | Medium | Points system |

### Phase 2: Engagement

| Element | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| Streaks | High | Medium | Daily tracking |
| Challenges | Medium | High | Points, badges |
| Leaderboards | Medium | Medium | Points system |
| Notifications | High | Medium | All elements |

### Phase 3: Social

| Element | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| Teams | Medium | High | User system |
| Social sharing | Low | Low | Achievements |
| Peer help | Medium | High | Community features |

---

## 9. Measurement & Optimization

### Key Performance Indicators

| KPI | Baseline | Target | Measurement |
|-----|----------|--------|-------------|
| DAU/MAU ratio | [%] | [%] | Analytics |
| Average session length | [min] | [min] | Analytics |
| Completion rate | [%] | [%] | LMS data |
| Badge earn rate | [#/month] | [#/month] | Gamification data |
| Streak retention | [%] | [%] | Gamification data |
| Leaderboard engagement | [%] | [%] | Analytics |

### A/B Testing Plan

| Test | Variable | Hypothesis | Success Metric |
|------|----------|------------|----------------|
| [Test 1] | [What varies] | [Expected outcome] | [How to measure] |
| [Test 2] | [What varies] | [Expected outcome] | [How to measure] |

---

## 10. Risk Assessment

### Potential Issues

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Over-gamification | Medium | High | Focus on learning first |
| Leaderboard demotivation | High | Medium | Add personal progress focus |
| Reward inflation | Medium | Medium | Regular economy review |
| Cheating/gaming | Low | High | Anti-gaming measures |
| Intrinsic motivation loss | Medium | High | Balance extrinsic rewards |

### Anti-Gaming Measures

| Exploit | Prevention |
|---------|------------|
| Point farming | Daily caps, diminishing returns |
| Badge hoarding | Meaningful requirements, time gates |
| Leaderboard manipulation | Verification, anti-fraud detection |
| Streak cheating | Activity validation, streak freeze limits |

---

## Approval and Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Instructional Designer | | | |
| UX Designer | | | |
| Product Manager | | | |
| Developer Lead | | | |
| Stakeholder | | | |

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | [Date] | Initial draft | [Name] |
| 1.0 | [Date] | Final version | [Name] |

---

*Template Version: 1.0*
*Part of the E-Learning and Gamification Design Skill*
