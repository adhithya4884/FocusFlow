# FocusFlow – Pomodoro Focus & Productivity Manager ⏳

A modern, high-performance, SaaS-grade productivity web application built with **React 19**, **Vite**, **Tailwind CSS**, **Recharts**, and the native **HTML5 Web Audio API**.

FocusFlow empowers students, developers, and professionals to master their focus, build long-lasting habits, eliminate context switching, and visualize productivity trends.

---

## 🌟 Key Highlights & Features

### 1. High-Precision Drift-Free Pomodoro Engine
* **Zero Background Tab Drift:** Uses `Date.now()` timestamp deltas instead of plain `setInterval` counting. Even if browsers throttle inactive tabs, the timer stays 100% accurate.
* **Persistent Sessions:** Active countdowns survive page reloads and browser restarts without resetting.
* **Smart Cycles:** Automatic cycle progression (e.g. Focus ➔ Short Break ➔ Long Break after 4 sessions) with optional auto-start toggles.
* **Interactive Circular Progress Ring:** Smooth animated SVG ring with contextual gradient glows (Purple for Focus, Cyan for Short Break, Emerald for Long Break).

### 2. Task Management & Direct Timer Integration
* **One-Click Focus:** Click **"Focus"** on any task to immediately mount it to the Pomodoro timer.
* **Auto-Incrementing Pomodoro Counts:** When a focus session finishes, the attached task's completed Pomodoro count automatically increments (e.g. 🍅 1/3 ➔ 2/3), automatically suggesting completion when the target is reached.
* **Task Priorities & Categories:** Color-coded priority badges (High, Medium, Low) and categories (*Coding*, *Study*, *Work*, *Design*, *General*).
* **Search & Filters:** Real-time search by keywords, filter by status (All, Pending, Completed), and priority filters.

### 3. Procedural Web Audio Ambient Sound Generator (100% Offline)
* **Zero External Audio Dependencies:** Generated entirely via native browser oscillators and noise synthesis buffers—no broken external MP3 links, CORS errors, or copyright issues!
* **Soundscapes:**
  * 🌧️ *Rain & Thunder* (Velvety dual-filter rainfall, high-frequency raindrop pings & rolling sub-bass thunder)
  * 🌊 *Ocean Waves* (Deep surging sub-bass swell with 6s rhythmic ebb-and-flow & airy foam wash)
  * 🔥 *Crackling Campfire* (Cozy low-frequency wood rumble with organic crackle bursts & steam-pop thumps)
  * ⏰ *Clockwork Pendulum* (Mechanical wooden escapement with crisp dual-click tick/tock resonance)
  * 🥣 *Tibetan Singing Bowl* (Bronze harmonic series with gentle 0.32Hz rotary acoustic shimmer)
* **1-Click Global Audio Control:** Instant Play/Stop toggles right from the top Navbar, popup menu, Focus Timer soundbar, and a persistent floating mini audio controller across all pages.
* **Completion Chimes:** *Zen Singing Bowl*, *Digital Arpeggio*, *Resonant Gong*, and *Wooden Marimba*.

### 4. Comprehensive Productivity Analytics & Heatmap
* **Real Calculated Metrics:** 100% dynamic analytics derived from stored session logs—no hardcoded placeholders.
* **Interactive Visualizations (Recharts):**
  * 7-Day & 14-Day Daily Focus Hours Bar Chart
  * 4-Week Focus Momentum Curve
  * Session Type Distribution Donut Chart (Focus vs. Short Break vs. Long Break)
* **GitHub-Style Contribution Heatmap:** 35-day focus activity matrix with multi-tier intensity levels.
* **Audit Log:** Complete history table with session timestamps, durations, and attached task names.

### 5. Gamification & Calendar-Accurate Streaks
* **Genuine Streak Logic:** Evaluates actual calendar dates to track consecutive active days. If you focused today or yesterday, your streak remains unbroken.
* **12 Achievement Badges:** *First Focus*, *Consistency*, *Deep Worker*, *Focus Master*, *Centurion*, *Habit Builder*, *Dedicated*, *Unstoppable*, *Productivity Champion*, *Task Crusher*, *Early Bird*, and *Night Owl*.
* **Celebratory Confetti:** Confetti particle bursts (`canvas-confetti`) when completing daily goals or unlocking milestones.

### 6. Distraction-Free Zen Mode (`F` Key)
* Fullscreen minimalist canvas displaying a giant digital countdown, active task title, ambient soundscape controls, and instant escape (`Esc` or `F`).

### 7. Persistent Mini Global Timer Widget
* When navigating away from the Timer tab to check tasks or analytics, a compact pill in the header displays live remaining time and allows quick play/pause.

### 8. Data Portability & Evaluation Sandbox
* **Export / Import JSON:** Full backup and restore with schema validation.
* **Load Demo Data Toggle:** 1-click button in Settings to instantly seed 14 days of realistic sessions, tasks, and streaks to test all charts and achievements immediately.
* **Data Reset:** Clean application wipe with confirmation safety.

---

## 💻 Tech Stack

* **Frontend:** React 19, JavaScript (ES Modules)
* **Build Tool:** Vite
* **Styling:** Tailwind CSS (Modern Theme Tokens, Dark Mode default, Glassmorphism)
* **Icons:** `lucide-react`
* **Charts:** `recharts`
* **Celebration FX:** `canvas-confetti`
* **Audio Engine:** Native HTML5 Web Audio API
* **Storage:** LocalStorage with atomic serialization and fallback safety

---

## 📁 Project Structure

```text
FocusFlow/
├── public/
│   └── favicon.svg              # SVG application icon
├── src/
│   ├── components/
│   │   ├── AchievementBadge.jsx # Gamification badge with progress & unlock status
│   │   ├── ActivityHeatmap.jsx  # 35-day GitHub-style contribution matrix
│   │   ├── CircularTimer.jsx    # SVG circular countdown timer with animated glow
│   │   ├── FocusCharts.jsx      # Recharts Bar, Area, and Donut visualizations
│   │   ├── KeyboardShortcutsModal.jsx # Shortcuts cheat-sheet HUD (? key)
│   │   ├── MobileNav.jsx        # Bottom navigation bar for smartphones
│   │   ├── Navbar.jsx           # Topbar with mini global timer, streak pill & theme
│   │   ├── Sidebar.jsx          # Desktop sidebar navigation
│   │   ├── StatCard.jsx         # SaaS KPI card component
│   │   ├── TaskCard.jsx         # Interactive task item with progress bar & focus action
│   │   ├── TaskFormModal.jsx    # Task creation & editing modal with validation
│   │   ├── TimerControls.jsx    # Play, Pause, Reset, Skip, and mode switcher buttons
│   │   └── ZenFocusMode.jsx     # Fullscreen distraction-free overlay
│   ├── context/
│   │   └── AppContext.jsx       # Central state management & LocalStorage sync
│   ├── hooks/
│   │   └── usePomodoro.js       # Timestamp-delta countdown engine & state recovery
│   ├── pages/
│   │   ├── Achievements.jsx     # Streaks, milestones & unlockable badges
│   │   ├── Dashboard.jsx        # SaaS productivity overview & today's priority list
│   │   ├── FocusTimer.jsx       # Main focus page with task assignment & ambient audio
│   │   ├── Settings.jsx         # Durations, alerts, goals, demo data & backup JSON
│   │   ├── Statistics.jsx       # Aggregate analytics, charts & session audit log
│   │   └── Tasks.jsx            # Task CRUD, filters, priority tagging & search
│   ├── utils/
│   │   ├── achievements.js      # Achievement definitions & evaluation logic
│   │   ├── audioEngine.js       # Web Audio API synthesizers (chimes & noise generators)
│   │   ├── dateUtils.js         # Streak calculations, date formatting & greetings
│   │   ├── notifications.js     # Desktop browser notification wrapper
│   │   ├── statistics.js        # Data aggregators for Recharts & heatmap
│   │   └── storage.js           # LocalStorage wrapper, demo data generator & JSON export
│   ├── App.jsx                  # Master view orchestrator & keyboard shortcut listener
│   ├── index.css                # Tailwind CSS imports, themes & custom scrollbars
│   └── main.jsx                 # React root rendering
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite & Tailwind configuration
└── README.md                    # Comprehensive documentation
```

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Space` | Start / Pause active Pomodoro timer |
| `R` | Reset current session to default duration |
| `S` | Skip to the next session (Break or Focus) |
| `F` | Toggle Fullscreen Zen Focus Mode |
| `M` | Mute / Play procedural ambient soundscape |
| `?` | Toggle Keyboard Shortcuts Cheat-Sheet HUD |
| `Esc` | Exit Zen Mode or close open modals |

*(Shortcuts are automatically disabled when typing in inputs or textareas).*

---

## 🚀 Getting Started & Local Development

### Prerequisites
* Node.js (v18.0.0 or higher recommended)
* npm (v9.0.0 or higher)

### Installation
1. Clone or navigate to the project directory:
   ```bash
   cd FocusFlow
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit:
   ```text
   http://localhost:5173
   ```

### Building for Production
To generate an optimized production bundle:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🧪 Testing Checklist

Verify all core flows before final evaluation:
- [x] **Timer Precision:** Timer updates every second and accurately calculates elapsed time using `Date.now()`.
- [x] **Background Tabs:** Switching tabs or leaving the browser does not throttle or drift the timer.
- [x] **Page Refresh Recovery:** Refreshing during an active Pomodoro resumes smoothly at the exact second without resetting.
- [x] **Task Integration:** Clicking "Focus" on a task binds it to the timer; completing the timer increments its completed Pomodoros.
- [x] **Streak Calculation:** Completed sessions compute consecutive calendar days correctly.
- [x] **Demo Data:** Clicking "Load Demo Data" in Settings immediately populates 14 days of realistic sessions, tasks, and streaks.
- [x] **Sound Engine:** Test "Zen Bell", "Digital", "Gong", and "Marimba" procedural chimes under Settings.
- [x] **Ambient Audio:** Play Rain, Brown Noise, White Noise, or 40Hz Binaural Beats and adjust volume.
- [x] **Data Portability:** Export JSON backup, clear data, and re-import the backup file.
- [x] **Keyboard Navigation:** Test `Space`, `R`, `S`, `F`, `M`, and `?` while ensuring typing in task title inputs does not trigger shortcuts.
- [x] **Responsive Design:** Verify fluid layout across desktop (sidebar), tablet, and mobile (bottom navigation bar).

---

## 📦 Deployment Guide

### Deploying to Vercel
1. Install the Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Accept default settings (Vite framework preset).

### Deploying to Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`

### Deploying to GitHub Pages
1. In `vite.config.js`, set `base: './'`
2. Build with `npm run build`
3. Push the `dist` folder to your `gh-pages` branch.

---

## 📄 License
MIT License. Built with passion for Project 4!
