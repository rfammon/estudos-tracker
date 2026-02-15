# UX Patterns Library for E-Learning

This document catalogs user experience patterns specifically designed for e-learning applications.

---

## 1. Navigation Patterns

### 1.1 Linear Navigation

**Description**: Sequential progression through content with clear previous/next controls.

**When to Use**:
- Compliance training
- Onboarding sequences
- Sequential skill building
- Mandatory content

**Components**:
- Previous/Next buttons
- Progress indicator
- Module list (collapsible)
- Current position highlight

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Module 3: Introduction to X         │
│ ━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━     │
│                                     │
│ [Content Area]                      │
│                                     │
│ ┌─────────┐              ┌────────┐ │
│ │ ← Prev  │              │ Next → │ │
│ └─────────┘              └────────┘ │
└─────────────────────────────────────┘
```

**Best Practices**:
- Always show progress
- Allow returning to previous content
- Disable Next until content viewed
- Provide estimated time remaining

### 1.2 Non-Linear Navigation

**Description**: User-controlled access to content through menus, search, and bookmarks.

**When to Use**:
- Reference materials
- Advanced learners
- Just-in-time learning
- Large content libraries

**Components**:
- Search functionality
- Table of contents
- Bookmarks/favorites
- Recently viewed
- Content tags

**Example Structure**:
```
┌────────────┬────────────────────────┐
│ Search...  │                        │
├────────────┤ [Content Area]         │
│ ▼ Module 1 │                        │
│   Lesson 1 │                        │
│   Lesson 2 │                        │
│ ▶ Module 2 │                        │
│ ▼ Module 3 │                        │
│   Lesson 1 │                        │
│  ●Lesson 2 │ ← Current              │
│   Lesson 3 │                        │
├────────────┤                        │
│ ★ Bookmarks│                        │
│ 🕐 Recent  │                        │
└────────────┴────────────────────────┘
```

**Best Practices**:
- Show completion status for each item
- Enable search across all content
- Allow bookmarking at any point
- Remember last position

### 1.3 Adaptive Navigation

**Description**: AI-driven content recommendations based on learner behavior and performance.

**When to Use**:
- Personalized learning paths
- Adaptive learning systems
- Remediation needs
- Advanced learner acceleration

**Components**:
- Recommended next steps
- Personalized path
- Difficulty adjustment
- Learning style adaptation

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Your Learning Path                  │
├─────────────────────────────────────┤
│ ✓ Introduction (Complete)           │
│ ✓ Basics (Complete)                 │
│ → Current: Intermediate             │
│   💡 Recommended based on your      │
│      quiz performance               │
│                                     │
│ ⚡ Skip ahead? You've shown mastery │
│    in 2 concepts                    │
│                                     │
│ 📋 Up Next:                         │
│    • Advanced Techniques            │
│    • Practice Lab                   │
└─────────────────────────────────────┘
```

**Best Practices**:
- Explain why content is recommended
- Allow learners to override recommendations
- Balance personalization with discovery
- Monitor recommendation effectiveness

---

## 2. Content Presentation Patterns

### 2.1 Microlearning Card

**Description**: Single-concept learning unit in a compact, focused format.

**Structure**:
- Duration: 3-5 minutes
- Single learning objective
- One concept per card
- Mobile-optimized

**Example Structure**:
```
┌─────────────────────────────────────┐
│ ⏱️ 3 min          Module 2 of 10   │
├─────────────────────────────────────┤
│                                     │
│        [Visual/Media Area]          │
│                                     │
├─────────────────────────────────────┤
│ Concept: Active Listening           │
│                                     │
│ Active listening means fully        │
│ concentrating on what is being      │
│ said rather than just passively     │
│ hearing the speaker.                │
│                                     │
│ Key techniques:                     │
│ • Pay attention                     │
│ • Show you're listening             │
│ • Provide feedback                  │
│                                     │
├─────────────────────────────────────┤
│ [← Previous]        [Next →]        │
└─────────────────────────────────────┘
```

**Best Practices**:
- Lead with the most important information
- Use visuals to support text
- Include one key takeaway
- End with a quick check

### 2.2 Interactive Video

**Description**: Video content with embedded interactions and branching.

**Components**:
- Play/pause controls
- Interactive hotspots
- Branching decision points
- Embedded quizzes
- Transcript/captions

**Example Structure**:
```
┌─────────────────────────────────────┐
│ ▶ ━━━━━━━━━●━━━━━━━━━━━━━━  2:34   │
├─────────────────────────────────────┤
│                                     │
│        [Video Content]              │
│                                     │
│   ┌─────────────────────────┐       │
│   │ What should the manager │       │
│   │ do next?                │       │
│   │                         │       │
│   │ A) Schedule a meeting   │       │
│   │ B) Send an email        │       │
│   │ C) Call immediately     │       │
│   └─────────────────────────┘       │
│                                     │
├─────────────────────────────────────┤
│ CC ON  │ 1x Speed  │ Chapters      │
└─────────────────────────────────────┘
```

**Best Practices**:
- Keep interactions meaningful
- Allow skipping with summary
- Provide clear instructions
- Support keyboard navigation

### 2.3 Scenario-Based Learning

**Description**: Realistic situations where learners make decisions and see consequences.

**Components**:
- Character introduction
- Situation setup
- Decision points
- Consequence feedback
- Reflection prompts

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Scenario: The Difficult Client      │
├─────────────────────────────────────┤
│                                     │
│ 👤 You are: Customer Success Manager│
│                                     │
│ 📍 Situation:                       │
│ A long-term client is threatening   │
│ to cancel their contract due to     │
│ recent service issues.              │
│                                     │
│ 💬 The client says:                 │
│ "This is unacceptable. I want to    │
│ speak to your manager immediately!" │
│                                     │
├─────────────────────────────────────┤
│ What do you do?                     │
│                                     │
│ A) Apologize and get your manager   │
│                                     │
│ B) Ask questions to understand      │
│    their concerns first             │
│                                     │
│ C) Explain the issues were not      │
│    your company's fault             │
│                                     │
└─────────────────────────────────────┘
```

**Best Practices**:
- Make scenarios realistic and relevant
- Show consequences of choices
- Allow retry with different choices
- Debrief after completion

### 2.4 Interactive Diagram

**Description**: Visual representations with clickable elements for exploration.

**Components**:
- Visual diagram/image
- Clickable hotspots
- Information panels
- Zoom controls
- Related content links

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Project Lifecycle                   │
├─────────────────────────────────────┤
│                                     │
│   ┌───────┐                         │
│   │ Init  │ ← Click to explore      │
│   └───┬───┘                         │
│       ↓                             │
│   ┌───────┐     ┌─────────────────┐ │
│   │ Plan  │────→│ Planning Phase  │ │
│   └───┬───┘     │ • Define scope  │ │
│       ↓         │ • Set timeline  │ │
│   ┌───────┐     │ • Assign team   │ │
│   │Execute│     └─────────────────┘ │
│   └───┬───┘                         │
│       ↓                             │
│   ┌───────┐                         │
│   │ Close │                         │
│   └───────┘                         │
│                                     │
├─────────────────────────────────────┤
│ 🔍 Zoom: [-] 100% [+]               │
└─────────────────────────────────────┘
```

**Best Practices**:
- Indicate interactive elements clearly
- Provide keyboard alternatives
- Show progress through exploration
- Allow free exploration mode

---

## 3. Assessment Patterns

### 3.1 Knowledge Check

**Description**: Low-stakes questions during learning to verify understanding.

**Components**:
- Question text
- Answer options
- Immediate feedback
- Explanation
- Try again option

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Quick Check                         │
├─────────────────────────────────────┤
│ What is the primary benefit of      │
│ active listening?                   │
│                                     │
│ ○ A) It saves time in conversations │
│                                     │
│ ○ B) It builds trust and            │
│      understanding                  │
│                                     │
│ ○ C) It helps you speak more        │
│                                     │
│ ○ D) It prevents conflicts          │
│                                     │
├─────────────────────────────────────┤
│ 💡 Hint (1 remaining)               │
│                                     │
│           [Check Answer]            │
└─────────────────────────────────────┘
```

**Best Practices**:
- Provide immediately after content
- Allow multiple attempts
- Explain correct answers
- Don't penalize wrong answers heavily

### 3.2 Drag-and-Drop Categorization

**Description**: Sorting items into categories for classification learning.

**Components**:
- Draggable items
- Drop zones/categories
- Visual feedback
- Score summary

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Categorize Communication Styles     │
├─────────────────────────────────────┤
│ Items:                              │
│ ┌─────────┐ ┌─────────┐ ┌────────┐  │
│ │ Direct  │ │ Indirect│ │ Assert │  │
│ └─────────┘ └─────────┘ └────────┘  │
│                                     │
│ ┌─────────────────┐ ┌─────────────┐ │
│ │   Assertive     │ │  Passive    │ │
│ │                 │ │             │ │
│ │  Drop here      │ │  Drop here  │ │
│ │                 │ │             │ │
│ └─────────────────┘ └─────────────┘ │
│                                     │
│ ┌─────────────────┐                 │
│ │   Aggressive    │                 │
│ │                 │                 │
│ │  Drop here      │                 │
│ │                 │                 │
│ └─────────────────┘                 │
├─────────────────────────────────────┤
│           [Check Answers]           │
└─────────────────────────────────────┘
```

**Best Practices**:
- Limit items to 5-7 per category
- Provide clear category labels
- Show correct placement after submission
- Support keyboard alternatives

### 3.3 Simulation Assessment

**Description**: Realistic task performance in a simulated environment.

**Components**:
- Realistic interface
- Task instructions
- Performance tracking
- Step-by-step guidance (optional)
- Results summary

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Simulation: Configure Security      │
├─────────────────────────────────────┤
│ Task: Set up two-factor auth        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Settings                        │ │
│ │ ├─ Account                      │ │
│ │ ├─ Security ←                   │ │
│ │ │  ├─ Password                  │ │
│ │ │  ├─ 2FA [Enable] ← Click here │ │
│ │ │  └─ Sessions                  │ │
│ │ └─ Notifications                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Steps completed: 2/5                │
│ Time: 1:23                          │
├─────────────────────────────────────┤
│ 💡 Hint available                   │
└─────────────────────────────────────┘
```

**Best Practices**:
- Mirror real tools/interfaces
- Allow mistakes and recovery
- Provide hints for struggling learners
- Score on process, not just outcome

### 3.4 Peer Review

**Description**: Learners evaluate each other's work using provided criteria.

**Components**:
- Submission area
- Rubric/criteria
- Peer assignments
- Feedback form
- Aggregated feedback view

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Peer Review: Project Proposal       │
├─────────────────────────────────────┤
│ Reviewing: Anonymous Peer #3        │
│                                     │
│ Submission:                         │
│ "My project proposal focuses on..." │
│                                     │
├─────────────────────────────────────┤
│ Evaluation Criteria:                │
│                                     │
│ Clarity of objectives:              │
│ ★★★★☆ (4/5)                        │
│                                     │
│ Feasibility:                        │
│ ★★★☆☆ (3/5)                        │
│                                     │
│ Innovation:                         │
│ ★★★★★ (5/5)                        │
│                                     │
│ Comments:                           │
│ ┌─────────────────────────────────┐ │
│ │ Your objective is clear, but... │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│           [Submit Review]           │
└─────────────────────────────────────┘
```

**Best Practices**:
- Provide clear rubrics
- Train learners on giving feedback
- Use anonymous reviews
- Require multiple reviews per submission

---

## 4. Feedback Patterns

### 4.1 Immediate Corrective Feedback

**Description**: Instant response to learner actions with correction.

**Components**:
- Correct/incorrect indication
- Explanation
- Next step guidance

**Example - Correct**:
```
┌─────────────────────────────────────┐
│ ✅ Correct!                         │
├─────────────────────────────────────┤
│ Active listening does build trust   │
│ and understanding by showing the    │
│ speaker they are valued.            │
│                                     │
│ Key point: Active listening         │
│ requires focus, not just hearing.   │
│                                     │
│           [Continue →]              │
└─────────────────────────────────────┘
```

**Example - Incorrect**:
```
┌─────────────────────────────────────┐
│ ❌ Not quite                        │
├─────────────────────────────────────┤
│ While saving time might seem like   │
│ a benefit, the primary purpose of   │
│ active listening is to build trust  │
│ and understanding.                  │
│                                     │
│ The correct answer is B.            │
│                                     │
│ [Try Again]        [Continue →]     │
└─────────────────────────────────────┘
```

### 4.2 Progress Celebration

**Description**: Visual celebration of achievements and milestones.

**Components**:
- Animation/visual effect
- Achievement details
- Share option
- Next goal preview

**Example Structure**:
```
┌─────────────────────────────────────┐
│          🎉 CONGRATULATIONS!        │
│                                     │
│         [Badge Animation]           │
│                                     │
│     You earned: "Quick Learner"     │
│                                     │
│   Completed 5 lessons in one day!   │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│   Next badge: "Week Warrior"        │
│   2 more days to unlock             │
│                                     │
│ [Share]           [Continue →]      │
└─────────────────────────────────────┘
```

### 4.3 Progress Dashboard

**Description**: Comprehensive view of learning progress and achievements.

**Components**:
- Overall progress
- Module completion
- Skill development
- Achievements earned
- Time spent
- Comparison (optional)

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Your Progress                       │
├─────────────────────────────────────┤
│ Overall Completion                  │
│ ████████████░░░░░░░░ 65%           │
│                                     │
│ ┌─────────────┐ ┌─────────────────┐ │
│ │ Modules     │ │ Time Spent      │ │
│ │ 8 of 12     │ │ 12h 34m         │ │
│ └─────────────┘ └─────────────────┘ │
│                                     │
│ Recent Achievements:                │
│ 🏅 Quick Learner  🏅 First Week    │
│                                     │
│ Skills Developed:                   │
│ Communication  ████████░░ 80%      │
│ Leadership     ██████░░░░ 60%      │
│ Problem Solv.  ███████░░░ 70%      │
│                                     │
│ Streak: 🔥 7 days                   │
└─────────────────────────────────────┘
```

---

## 5. Gamification UI Patterns

### 5.1 XP and Level Display

**Description**: Persistent display of experience points and current level.

**Components**:
- Current level indicator
- XP progress bar
- XP to next level
- Recent XP gains

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Level 12          2,450 / 3,000 XP │
│ ████████████████░░░░░░░░░░░░░░░░░░ │
│                                     │
│ +50 XP for completing lesson!       │
└─────────────────────────────────────┘
```

### 5.2 Badge Collection

**Description**: Gallery of earned and available badges.

**Components**:
- Earned badges (highlighted)
- Locked badges (grayed)
- Progress toward locked badges
- Badge details on hover/click

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Your Badges (8/24)                  │
├─────────────────────────────────────┤
│ Earned:                             │
│ 🏅 First Steps    🏅 Quick Learn    │
│ 🏅 Week Warrior   🏅 Night Owl      │
│ 🏅 Social Star    🏅 Perfect Score  │
│ 🏅 Helper         🏅 Early Bird     │
│                                     │
│ In Progress:                        │
│ 🔒 Master (60% - 3 more modules)    │
│ 🔒 Streak King (7/14 days)          │
│                                     │
│ Locked:                             │
│ 🔒 ???                             │
│ 🔒 ???                             │
└─────────────────────────────────────┘
```

### 5.3 Leaderboard

**Description**: Ranking display showing relative performance.

**Components**:
- Current user position (highlighted)
- Top performers
- Score/XP values
- Time period selector

**Example Structure**:
```
┌─────────────────────────────────────┐
│ Leaderboard    [This Week ▼]        │
├─────────────────────────────────────┤
│ 1. 🥇 Alex M.          12,450 XP   │
│ 2. 🥈 Jordan K.        11,200 XP   │
│ 3. 🥉 Sam L.           10,890 XP   │
│ 4. Taylor R.           10,500 XP   │
│ 5. Casey B.            10,100 XP   │
│ ─────────────────────────────────── │
│ 23. YOU                 8,450 XP   │
│     ↑ 3 positions from last week   │
│ ─────────────────────────────────── │
│ 24. Morgan S.           8,400 XP   │
│ 25. Jamie W.            8,200 XP   │
└─────────────────────────────────────┘
```

### 5.4 Streak Counter

**Description**: Visual display of consecutive day engagement.

**Components**:
- Current streak count
- Visual streak indicator
- Longest streak record
- Streak freeze option

**Example Structure**:
```
┌─────────────────────────────────────┐
│ 🔥 7 Day Streak!                    │
├─────────────────────────────────────┤
│ M  T  W  T  F  S  S                 │
│ ✓  ✓  ✓  ✓  ✓  ✓  ●                │
│                                     │
│ Longest: 14 days                    │
│                                     │
│ ❄️ Streak Freeze: 1 available       │
└─────────────────────────────────────┘
```

---

## 6. Accessibility Patterns

### 6.1 Keyboard Navigation

**Requirements**:
- All interactive elements focusable
- Logical tab order
- Visible focus indicators
- Skip links for long content

**Implementation**:
```html
<!-- Skip link -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<!-- Focus management -->
<button 
  class="focus-visible:ring-2"
  aria-label="Next lesson"
>
  Next →
</button>
```

### 6.2 Screen Reader Support

**Requirements**:
- Semantic HTML structure
- ARIA labels for interactive elements
- Announcements for dynamic content
- Alternative text for images

**Implementation**:
```html
<!-- Progress announcement -->
<div 
  role="progressbar" 
  aria-valuenow="65" 
  aria-valuemin="0" 
  aria-valuemax="100"
  aria-label="Course progress: 65%"
>
  <!-- Visual progress bar -->
</div>

<!-- Achievement announcement -->
<div 
  role="alert" 
  aria-live="polite"
>
  Congratulations! You earned the Quick Learner badge.
</div>
```

### 6.3 Color and Contrast

**Requirements**:
- 4.5:1 contrast ratio for text
- 3:1 for large text and UI components
- Don't rely on color alone
- Provide color alternatives

**Implementation**:
```css
/* Ensure sufficient contrast */
.text-primary {
  color: #1a1a1a; /* Dark text on light bg */
  background-color: #ffffff;
}

/* Don't rely on color alone */
.status-complete {
  color: #055a14;
  background-color: #d4edda;
  border-left: 4px solid #055a14; /* Additional indicator */
}

.status-complete::before {
  content: "✓ "; /* Icon indicator */
}
```

---

## Pattern Selection Matrix

| Content Type | Navigation | Presentation | Assessment | Feedback |
|--------------|------------|--------------|------------|----------|
| Compliance | Linear | Microlearning | Quiz-based | Immediate |
| Technical | Non-linear | Interactive | Simulation | Detailed |
| Soft Skills | Adaptive | Scenario | Peer Review | Reflective |
| Reference | Search | Interactive Diagram | Self-check | On-demand |
| Onboarding | Linear | Video | Knowledge Check | Celebratory |

---

*Part of the E-Learning and Gamification Design Skill*
