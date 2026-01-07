# 🌱 Goal Garden

A modern, goal-setting and habit-tracking application built with Next.js. Goal Garden helps you plant seeds of ambition, nurture your habits, and watch your progress grow.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)

## ✨ Features

### 🎯 Goal Management
- **Create Long-Term Goals** — Define your vision with a title, motivation, and optional deadline
- **Goal Color Coding** — Personalize each goal with custom colors for easy visual identification
- **Dual View Modes** — Switch between **Rhythm Mode** (habits) and **Deadline Mode** (milestones) per goal
- **Progress Tracking** — Visualize goal completion percentage across all action items

### 📅 Rhythm Mode (Habits & Recurring Tasks)
Build consistent habits with flexible scheduling options:
- **Daily Habits** — Track daily routines with streak counting
- **Weekly Habits** — Set weekly recurring tasks
- **Monthly Habits** — Schedule monthly check-ins
- **Quarterly Habits** — Plan quarterly reviews and assessments
- **Streak Tracking** — Monitor your consistency with current streak counts
- **Vibe Check** — See your last activity date at a glance

### 🏁 Deadline Mode (Milestones & One-Off Tasks)
Manage project milestones and tasks with deadlines:
- **Milestone Creation** — Create actionable milestones with deadlines
- **Drag-and-Drop Reordering** — Prioritize tasks with intuitive sorting
- **Sort by Deadline or Manual Order** — Toggle between automatic and custom ordering
- **Filter Completed Items** — Toggle between "All" and "Incomplete" views
- **Urgency & Importance Tags** — Mark items for Eisenhower Matrix integration

### 📊 Dashboard
Your daily command center with customizable views:
- **Rhythm Section** — Toggle between Daily, Weekly, Monthly, and Quarterly habits
- **Deadline Section** — Filter upcoming milestones by time range (7, 14, 30, 60, or 90 days)
- **Quick Action Cards** — Complete habits and milestones with one click
- **Streak Widget** — See your current streaks at a glance

### 🧠 Eisenhower Matrix
Prioritize your work using the proven 4-quadrant system:
- **Drag-and-Drop Interface** — Move items between quadrants
- **Inbox System** — Unclassified items start in the inbox
- **Goal-Based Filtering** — Filter matrix by specific goals
- **Dashboard Integration** — Access matrix from the main dashboard
- **Per-Goal Matrix** — View matrix for individual goals in Deadline Mode

### 📈 Timeline View
Visualize your goals on an interactive Gantt-style chart:
- **Global Timeline** — See all goals and milestones in one view
- **Day-by-Day Columns** — Precise deadline visualization
- **Milestone Markers** — Sprout icons indicate upcoming milestones
- **Progress Bars** — Visual completion tracking for each goal
- **Goal Color Integration** — Chart bars match your goal colors

### 🎨 Theming & Customization
Beautiful, modern UI with multiple themes:
- **Light/Dark Mode** — Toggle between light and dark backgrounds
- **Dark Mode Color Themes**:
  - **Midnight Navy** — Deep blue tones (default)
  - **Deep Forest** — Rich green palette
  - **Obsidian** — Neutral dark grey
- **Responsive Design** — Works on desktop and mobile

### 🔐 Authentication
Secure user authentication with multiple options:
- **Email/Password** — Traditional sign-up and login
- **Google OAuth** — One-click Google authentication
- **Password Reset** — Secure password recovery flow
- **Session Management** — Persistent secure sessions

### ⚙️ Settings
Manage your account and preferences:
- **Profile Management** — Update your display name
- **Theme Selection** — Choose your preferred color scheme
- **Account Settings** — View email and reset password
- **Account Deletion** — Securely delete your account and data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/goal-garden.git
cd goal-garden
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure your `.env` file with:
- `DATABASE_URL` — SQLite database path
- `AUTH_SECRET` — NextAuth.js secret key
- `GOOGLE_CLIENT_ID` — Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET` — Google OAuth secret (optional)

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Database**: SQLite with [Prisma ORM](https://prisma.io)
- **Authentication**: [NextAuth.js v5](https://authjs.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com)
- **Date Utilities**: [date-fns](https://date-fns.org)

## 📁 Project Structure

```
goal-garden/
├── app/
│   ├── (app)/           # Authenticated routes
│   │   ├── dashboard/   # Main dashboard
│   │   ├── goals/       # Goal management
│   │   └── settings/    # User settings
│   ├── actions/         # Server actions
│   ├── api/             # API routes
│   ├── auth/            # Auth pages
│   └── login/           # Login page
├── components/
│   ├── cards/           # Card components
│   ├── dashboard/       # Dashboard components
│   ├── matrix/          # Eisenhower Matrix
│   ├── settings/        # Settings components
│   └── timeline/        # Timeline/Gantt views
├── lib/                 # Utilities
└── prisma/              # Database schema
```

## 📜 License

This project is private and proprietary.

---

<p align="center">
  <strong>🌱 Plant your goals. Nurture your habits. Watch yourself grow.</strong>
</p>
