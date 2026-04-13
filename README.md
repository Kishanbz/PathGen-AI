# PathGen-AI 🚀 AI-Powered Personalized Learning Path System

<div align="center">

**Enter any topic → Get a visual learning roadmap → Track your progress**

`Next.js` • `Tailwind CSS` • `React Flow` • `FastAPI` • `PostgreSQL` • `LangChain` • `Docker`

</div>

---

## 📋 Table of Contents

- [PathGen-AI 🚀 AI-Powered Personalized Learning Path System]

  - [📋 Table of Contents](#-table-of-contents)
  - [🚀 Project Overview](#-project-overview)
  - [❗ Problem Statement](#-problem-statement)
    - [Market Gap](#market-gap)
  - [✅ Features](#-features)
    - [🎯 Core Features](#-core-features)
    - [📌 Out of Scope](#-out-of-scope)
  - [🔄 How It Works](#-how-it-works)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ System Architecture](#️-system-architecture)
    - [Data Flow](#data-flow)
  - [📁 Project Structure](#-project-structure)
  - [🗄️ Database Schema](#️-database-schema)
  - [📡 API Endpoints](#-api-endpoints)
    - [Authentication](#authentication)
    - [Roadmap Generation](#roadmap-generation)
    - [Progress Tracking](#progress-tracking)
    - [User Dashboard](#user-dashboard)
    - [AI Tutor](#ai-tutor)
  - [⚙️ Installation \& Setup](#️-installation--setup)
    - [Prerequisites](#prerequisites)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Copy Environment Variables](#2-copy-environment-variables)
    - [3. Install Frontend Dependencies](#3-install-frontend-dependencies)
    - [4. Install Backend Dependencies](#4-install-backend-dependencies)
  - [🔐 Environment Variables](#-environment-variables)
  - [▶️ Running the Project](#️-running-the-project)
    - [Option 1: Docker Compose (Recommended)](#option-1-docker-compose-recommended)
    - [Option 2: Manual Run (Development)](#option-2-manual-run-development)
    - [Run Database Migrations](#run-database-migrations)
    - [Seed Sample Data](#seed-sample-data)
  - [📅 Development Timeline (12 Weeks)](#-development-timeline-12-weeks)
    - [🏗️ Month 1 — Foundation \& Core Setup (Weeks 1–4)](#️-month-1--foundation--core-setup-weeks-14)
    - [🤖 Month 2 — Core Features \& UI (Weeks 5–8)](#-month-2--core-features--ui-weeks-58)
    - [🎨 Month 3 — AI Features, Polish \& Deployment (Weeks 9–12)](#-month-3--ai-features-polish--deployment-weeks-912)
  - [📊 Non-Functional Requirements](#-non-functional-requirements)
  - [⚠️ Risk \& Mitigation](#️-risk--mitigation)
  - [🎯 Success Metrics](#-success-metrics)
    - [Technical](#technical)
    - [Functional](#functional)
  - [📖 Glossary](#-glossary)
  - [📞 Support](#-support)

---

## 🚀 Project Overview

**PathGen-AI** is an intelligent learning roadmap generator inspired by [roadmap.sh](https://roadmap.sh). Users enter any topic (e.g., "React.js", "Machine Learning", "Docker") and the AI generates a **visual, interactive learning path** — a tree-style flowchart with curated resources including YouTube videos, articles, and documentation links.

Unlike static learning platforms, PathGen-AI **dynamically creates personalized roadmaps** for any topic using AI, finds the best learning resources from the internet, and lets users **track their progress** as they complete each step.

| Attribute            | Details                                                     |
| -------------------- | ----------------------------------------------------------- |
| Project Name         | PathGen-AI — AI-Powered Personalized Learning Path System          |
| Project Category     | AI + EdTech + Web Application                               |
| Project Type         | College Final Year Submission                               |
| Development Duration | 3 Months (12 Weeks)                                         |
| Core Technologies    | Next.js, FastAPI, PostgreSQL, LangChain, React Flow, Docker |
| Inspired By          | [roadmap.sh](https://roadmap.sh)                            |
| Deployment           | Cloud / Local Docker Environment                            |

---

## ❗ Problem Statement

Learners today face critical challenges when trying to learn new skills:

- ❌ **No clear learning path** — beginners don't know where to start or what to learn next
- ❌ **Scattered resources** — YouTube videos, articles, and docs are spread across the internet with no structure
- ❌ **One-size-fits-all** — existing roadmaps are generic and don't adapt to the user's topic
- ❌ **No progress tracking** — learners lose motivation without a sense of achievement
- ❌ **Information overload** — too many resources, no curation or ordering
- ❌ **Time wasted searching** — hours spent finding the right tutorials instead of learning

### Market Gap

Platforms like roadmap.sh provide excellent curated roadmaps, but only for **pre-defined topics** (Frontend, Backend, DevOps, etc.). There is no tool that lets you enter **any arbitrary topic** and get an AI-generated, resource-rich visual roadmap instantly. **PathGen-AI fills this gap.**

---

## ✅ Features

### 🎯 Core Features

| Feature                  | Description                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| 🤖 AI Roadmap Generator  | Enter any topic → AI generates a structured learning roadmap with **latest web resources** |
| 🗺️ Interactive Flowchart | Tree-style visual roadmap with clickable nodes, zoom, and pan           |
| ⏳ Progress Loading    | Visual progress steps during roadmap generation                       |
| 🎉 Gamified UX           | Confetti explosion celebrations when marking topics as 'Done'           |
| 📦 Resource Discovery    | Each node has curated YouTube videos, articles, and documentation links |
| ✅ Progress Tracking     | Mark topics as Done / Skip / Pending with a live progress bar           |
| 🏠 Landing Page          | Hero section with topic search bar + featured popular roadmaps          |
| 🔍 Explore Page          | Browse community and pre-built roadmaps by category                     |
| 🔐 User Authentication   | Secured by **Clerk** (Sign up / login / profile) to save roadmaps       |
| 📊 Dashboard             | View all saved roadmaps with progress stats                             |
| 💬 AI Tutor (Per Topic)  | Ask AI questions about any specific topic node                          |
| 🌐 Shareable Roadmaps    | Public URLs to share generated roadmaps                                 |

### 📌 Out of Scope

- Live video streaming / virtual classrooms
- Mobile native app (iOS/Android) — web PWA only
- Payment gateway / subscriptions
- Third-party LMS integration

---

## 🔄 How It Works

```
1. User visits PathGen-AI → Enters a topic (e.g., "Kubernetes")
2. AI Engine (LangChain + GPT) generates a structured roadmap:
   → Breaks topic into sub-topics and milestones
   → Orders them in a logical learning sequence
   → Finds YouTube videos, articles, and docs for each sub-topic
3. Frontend renders an interactive flowchart (React Flow):
   → Nodes = sub-topics, Edges = learning order
   → Click any node → side drawer opens with resources
4. User marks nodes as Done / Skip → progress bar updates
5. Roadmap is saved to database → accessible from dashboard
```

---

## 🛠️ Tech Stack

| Layer            | Technology                             | Purpose                                      |
| ---------------- | -------------------------------------- | -------------------------------------------- |
| Frontend         | Next.js 14 (App Router) + Tailwind CSS | UI, pages, responsive design                 |
| Flowchart        | React Flow                             | Interactive node-based roadmap visualization |
| State Mgmt       | Zustand                                | Lightweight global state (auth, roadmap)     |
| Charts           | Recharts                               | Progress visualization                       |
| HTTP Client      | Axios                                  | API calls with JWT interceptors              |
| Forms            | React Hook Form + Zod                  | Input validation                             |
| Icons            | Lucide React                           | Modern SVG icons                             |
| Backend API      | Python FastAPI                         | Core REST API                                |
| AI / LLM         | LangChain + OpenAI GPT                 | Roadmap generation, resource curation        |
| Web Search       | Firecrawl / SerpAPI / Tavily           | Find latest YouTube links, articles, docs      |
| Database         | PostgreSQL                             | Users, roadmaps, progress, resources         |
| Caching          | Redis                                  | API response caching, rate limiting          |
| Containerization | Docker + Docker Compose                | Service orchestration                        |
| Authentication   | JWT + bcrypt                           | Secure user authentication                   |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│              PRESENTATION LAYER                  │
│     Next.js 14 + React Flow + Tailwind CSS       │
│   (Landing, Explore, Generate, Roadmap Viewer)   │
└────────────────────┬────────────────────────────┘
                     │ HTTP / REST (Axios + JWT)
┌────────────────────▼────────────────────────────┐
│                API LAYER                         │
│            FastAPI + Nginx                       │
│       (Auth, Roadmaps, Progress, Search)         │
└────────────────────┬────────────────────────────┘
          ┌──────────┼──────────┐
          ▼          ▼          ▼
┌──────────────┐ ┌────────┐ ┌──────────────┐
│  Business    │ │   AI   │ │   Resource   │
│   Logic      │ │ Engine │ │  Discovery   │
│ (CRUD, Auth) │ │LangChn │ │ (Firecrawl)  │
│              │ │ + GPT  │ │ (Live Web)   │
└──────┬───────┘ └───┬────┘ └──────┬───────┘
       │              │             │
┌──────▼──────────────▼─────────────▼───────┐
│              STORAGE LAYER                 │
│    PostgreSQL/SQLite (DB) + Redis (Cache)  │
└────────────────────────────────────────────┘
```

### Data Flow

1. User enters topic → Frontend sends POST to `/api/roadmap/generate`
2. AI Engine breaks topic into sub-topics → generates tree structure
3. Resource Discovery searches YouTube, articles, docs for each sub-topic
4. Complete roadmap JSON returned → Frontend renders flowchart via React Flow
5. User interacts with nodes → progress saved via PUT to `/api/roadmap/{id}/progress`

---

## 📁 Project Structure

```
pathgen-ai/
│
├── frontend/                              # Next.js Application
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── app/                           # App Router pages
│   │   │   ├── layout.jsx                 # Root layout (fonts, theme)
│   │   │   ├── page.jsx                   # Landing page
│   │   │   ├── globals.css                # Tailwind + custom styles
│   │   │   ├── explore/page.jsx           # Browse roadmaps
│   │   │   ├── generate/page.jsx          # AI generate input
│   │   │   ├── roadmap/[id]/page.jsx      # Roadmap viewer (CORE)
│   │   │   ├── login/page.jsx             # Login
│   │   │   ├── signup/page.jsx            # Sign up
│   │   │   └── dashboard/page.jsx         # My roadmaps
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                        # Base primitives
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Drawer.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   └── Skeleton.jsx
│   │   │   │
│   │   │   ├── layout/                    # Layout components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── MobileNav.jsx
│   │   │   │
│   │   │   ├── roadmap/                   # Flowchart components
│   │   │   │   ├── RoadmapCanvas.jsx      # Main React Flow canvas
│   │   │   │   ├── RoadmapNode.jsx        # Custom node component
│   │   │   │   ├── RoadmapConnector.jsx   # Custom edge/line styles
│   │   │   │   ├── RoadmapLegend.jsx      # Color meaning guide
│   │   │   │   ├── TopicDrawer.jsx        # Side drawer (resources)
│   │   │   │   └── ProgressHeader.jsx     # Title + progress bar
│   │   │   │
│   │   │   ├── landing/                   # Landing page sections
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── HowItWorks.jsx
│   │   │   │   └── FeaturedRoadmaps.jsx
│   │   │   │
│   │   │   └── cards/
│   │   │       └── RoadmapCard.jsx        # Card for explore/dashboard
│   │   │
│   │   ├── services/                      # API calls (Axios)
│   │   │   ├── api.js                     # Axios instance + interceptors
│   │   │   ├── roadmapService.js          # Generate, get, list roadmaps
│   │   │   ├── authService.js             # Login, signup
│   │   │   └── progressService.js         # Update node progress
│   │   │
│   │   ├── stores/                        # Zustand state
│   │   │   ├── authStore.js               # User auth + JWT
│   │   │   └── roadmapStore.js            # Current roadmap data
│   │   │
│   │   ├── hooks/                         # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   └── useRoadmap.js
│   │   │
│   │   ├── lib/                           # Utilities
│   │   │   ├── utils.js
│   │   │   └── constants.js
│   │   │
│   │   └── middleware.js                  # Auth route protection
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── jsconfig.json
│   └── .env.local
│
├── backend/                               # FastAPI Application
│   ├── routes/
│   │   ├── auth.py                        # Login, register, JWT
│   │   ├── roadmap.py                     # Generate, get, list roadmaps
│   │   ├── progress.py                    # Update node progress
│   │   └── explore.py                     # Browse public roadmaps
│   ├── models/
│   │   └── db_models.py                   # SQLAlchemy ORM models
│   ├── schemas/
│   │   └── pydantic_schemas.py            # Request/response schemas
│   ├── core/
│   │   ├── config.py                      # Environment config
│   │   ├── security.py                    # JWT & password hashing
│   │   └── database.py                    # DB connection
│   └── main.py                            # FastAPI entry point
│
├── backend/ai/                            # AI & Resource Discovery
│   ├── roadmap_generator.py               # LangChain roadmap generation
│   ├── firecrawl_client.py                # Firecrawl web search integration
│   ├── resource_finder.py                 # Web search for YouTube/articles
│   └── topic_analyzer.py                  # Break topic into sub-topics
│
├── database/
│   ├── migrations/                        # Alembic migration files
│   └── seed_data.py                       # Sample roadmaps for testing
│
├── docker-compose.yml                     # Full system orchestration
├── Dockerfile.backend                     # Backend Docker image
├── Dockerfile.frontend                    # Frontend Docker image
├── requirements.txt                       # Python dependencies
├── .env.example                           # Environment variables template
├── .gitignore
└── README.md                              # This file
```

---

## 🗄️ Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,         -- bcrypt hashed
    avatar_url  VARCHAR(500),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Roadmaps Table (AI Generated)
CREATE TABLE roadmaps (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id),
    author_id   VARCHAR(255),                  -- Clerk user ID
    title       VARCHAR(200) NOT NULL,         -- e.g., "React.js Learning Path"
    topic       VARCHAR(200) NOT NULL,         -- original user input
    description TEXT,
    is_public   BOOLEAN DEFAULT false,         -- SQLite: 0/1, PostgreSQL: false/true
    is_published INTEGER DEFAULT 0,              -- 0=private, 1=public
    visits      INTEGER DEFAULT 0,             -- View count
    metadata    JSONB,                         -- difficulty, estimated_time, etc.
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Roadmap Nodes Table (Sub-topics)
CREATE TABLE roadmap_nodes (
    id              SERIAL PRIMARY KEY,
    roadmap_id      INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
    label           VARCHAR(200) NOT NULL,     -- node display text
    description     TEXT,                      -- AI-generated explanation
    node_type       VARCHAR(20) DEFAULT 'topic', -- milestone / topic / optional
    position_x      FLOAT,                     -- x position on canvas
    position_y      FLOAT,                     -- y position on canvas
    parent_node_id  INTEGER REFERENCES roadmap_nodes(id),
    order_index     INTEGER,                   -- ordering within level
    status          VARCHAR(20) DEFAULT 'pending' -- pending / done / skip
);

-- Node Resources Table (YouTube, Articles, Docs)
CREATE TABLE node_resources (
    id          SERIAL PRIMARY KEY,
    node_id     INTEGER REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    type        VARCHAR(20) NOT NULL,          -- youtube / article / docs
    title       VARCHAR(300) NOT NULL,
    url         VARCHAR(500) NOT NULL,
    source      VARCHAR(100),                  -- e.g., "Traversy Media", "MDN"
    thumbnail   VARCHAR(500),                  -- YouTube thumbnail URL
    metadata    JSONB                          -- duration, views, etc.
);

-- Roadmap Connections/Edges Table
CREATE TABLE roadmap_edges (
    id          SERIAL PRIMARY KEY,
    roadmap_id  INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
    from_node   INTEGER REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    to_node     INTEGER REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    edge_type   VARCHAR(20) DEFAULT 'solid'    -- solid / dotted
);

-- User Progress (denormalized for quick access)
CREATE TABLE user_progress (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id),
    roadmap_id  INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
    node_id     INTEGER REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    status      VARCHAR(20) DEFAULT 'pending', -- pending / done / skip
    updated_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, roadmap_id, node_id)
);

-- Chat History (AI Tutor per node)
CREATE TABLE chat_history (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id),
    node_id     INTEGER REFERENCES roadmap_nodes(id),
    message     TEXT,
    response    TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| POST   | `/api/auth/signup`         | Register new user         |
| POST   | `/api/auth/login`          | Login & receive JWT token |
| POST   | `/api/auth/reset-password` | Password reset via email  |
| GET    | `/api/auth/me`             | Get current user profile  |

### Roadmap Generation

| Method | Endpoint                  | Description                                       |
| ------ | ------------------------- | ------------------------------------------------- |
| POST   | `/api/roadmaps/generate`   | Enter topic → AI generates full roadmap (with live resources) |
| GET    | `/api/roadmap/{id}`       | Get a specific roadmap with all nodes & resources |
| GET    | `/api/roadmaps/explore`   | List public/featured roadmaps                     |
| GET    | `/api/roadmaps/search?q=` | Search roadmaps by topic                          |
| DELETE | `/api/roadmap/{id}`       | Delete a roadmap                                  |

### Progress Tracking

| Method | Endpoint                     | Description                            |
| ------ | ---------------------------- | -------------------------------------- |
| PUT    | `/api/roadmap/{id}/progress` | Update node status (done/skip/pending) |
| GET    | `/api/roadmap/{id}/progress` | Get progress summary for a roadmap     |

### User Dashboard

| Method | Endpoint             | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| GET    | `/api/user/roadmaps` | List user's saved roadmaps                   |
| GET    | `/api/user/stats`    | User stats (total roadmaps, completion rate) |

### AI Tutor

| Method | Endpoint                      | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| POST   | `/api/chat/message`           | Ask AI about a specific topic node |
| GET    | `/api/chat/history/{node_id}` | Get chat history for a node        |

---

## ⚙️ Installation & Setup

### Prerequisites

```bash
# Check versions
node --version        # v18+
python --version      # 3.10+
docker --version      # 24+
docker compose version # 2.0+
```

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pathgen-ai.git
cd pathgen-ai
```

### 2. Copy Environment Variables

```bash
cp .env.example .env
# Edit .env with your actual values (see Environment Variables section)
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# ─── Database ───────────────────────────────
DATABASE_URL=postgresql://postgres:password@localhost:5432/pathgen_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=pathgen_db

# ─── JWT Auth ───────────────────────────────
SECRET_KEY=your_super_secret_jwt_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ─── OpenAI (for LangChain) ────────────────
OPENAI_API_KEY=sk-your-openai-api-key-here

# ─── Web Search (for resource discovery) ────
FIRECRAWL_API_KEY=your-firecrawl-api-key-here
SERP_API_KEY=your-serpapi-key-here

# ─── Redis ──────────────────────────────────
REDIS_URL=redis://localhost:6379/0

# ─── Frontend ───────────────────────────────
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## ▶️ Running the Project

### Option 1: Docker Compose (Recommended)

```bash
# Start all services in one command
docker compose up --build

# Services started:
# ✅ Frontend     → http://localhost:3000
# ✅ Backend API  → http://localhost:8000
# ✅ API Docs     → http://localhost:8000/docs
# ✅ PostgreSQL   → localhost:5432
# ✅ Redis        → localhost:6379
```

### Option 2: Manual Run (Development)

**Terminal 1 — Backend API**

```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

**Terminal 3 — PostgreSQL**

```bash
docker run -p 5432:5432 \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=pathgen_db \
  postgres:15
```

**Terminal 4 — Redis**

```bash
docker run -p 6379:6379 redis:alpine
```

### Run Database Migrations

```bash
cd backend
alembic upgrade head
```

### Seed Sample Data

```bash
cd database
python seed_data.py
```

---

## 📅 Development Timeline (12 Weeks)

### 🏗️ Month 1 — Foundation & Core Setup (Weeks 1–4)

| Week   | Tasks                                                                | Deliverable             |
| ------ | -------------------------------------------------------------------- | ----------------------- |
| Week 1 | Project setup, Docker config, DB schema design, Next.js scaffold     | Working dev environment |
| Week 2 | User auth (JWT), signup/login pages, protected routes                | Auth system             |
| Week 3 | AI roadmap generation — LangChain pipeline, topic → tree structure   | Roadmap generator v1    |
| Week 4 | Resource discovery — web search for YouTube, articles, docs per node | Resource-rich roadmaps  |

### 🤖 Month 2 — Core Features & UI (Weeks 5–8)

| Week   | Tasks                                                       | Deliverable           |
| ------ | ----------------------------------------------------------- | --------------------- |
| Week 5 | React Flow integration — interactive flowchart rendering    | Visual roadmap viewer |
| Week 6 | Topic drawer — click node → resources panel with tabs       | Resource browser      |
| Week 7 | Progress tracking — Done/Skip/Pending toggles, progress bar | Progress system       |
| Week 8 | Landing page, explore page, dashboard, responsive design    | Complete frontend     |

### 🎨 Month 3 — AI Features, Polish & Deployment (Weeks 9–12)

| Week    | Tasks                                                      | Deliverable         |
| ------- | ---------------------------------------------------------- | ------------------- |
| Week 9  | AI tutor chat per topic node, chat history                 | AI tutor            |
| Week 10 | Shareable roadmaps, public URLs, SEO                       | Social features     |
| Week 11 | Performance optimization, caching, error handling, testing | Production-ready    |
| Week 12 | Docker deployment, documentation, demo prep, bug fixes     | Final submission ✅ |

---

## 📊 Non-Functional Requirements

| Category        | Requirement                                                 |
| --------------- | ----------------------------------------------------------- |
| Performance     | Roadmap generation < 10 seconds, page load < 2 seconds      |
| Scalability     | Supports 500 concurrent users                               |
| Security        | bcrypt passwords, JWT expiry 24h, HTTPS, input sanitization |
| Availability    | 99% uptime target                                           |
| Usability       | Responsive design, works on mobile browsers                 |
| AI Quality      | Relevant resources, logical topic ordering                  |
| Maintainability | Docker containers, modular codebase                         |

---

## ⚠️ Risk & Mitigation

| Risk                                    | Probability | Impact | Mitigation                                     |
| --------------------------------------- | ----------- | ------ | ---------------------------------------------- |
| AI generates low-quality roadmaps       | Medium      | High   | Fine-tune prompts, add manual curation option  |
| OpenAI API cost overrun                 | Medium      | Medium | Set token limits, cache popular topics         |
| Web search returns irrelevant resources | Medium      | Medium | Filter by relevance score, allow user feedback |
| Feature scope creep                     | High        | High   | Strictly follow 12-week timeline               |
| React Flow performance with large trees | Low         | Medium | Virtualization, limit node count to 50         |
| DB performance under load               | Low         | Medium | PostgreSQL indexes, Redis caching              |

---

## 🎯 Success Metrics

### Technical

- [x] AI roadmap generation completes within 10 seconds
- [x] React Flow renders 50+ nodes smoothly with zoom/pan
- [x] All API endpoints working and tested via Swagger
- [x] `docker compose up` starts entire system in one command
- [x] Responsive design works on mobile, tablet, desktop

### Functional

- [x] Full user journey: Enter topic → Get roadmap → Browse resources → Track progress
- [x] Each node has at least 3 relevant resources (YouTube + articles + docs)
- [x] Progress tracking persists across sessions
- [x] Explore page shows community roadmaps with search/filter
- [x] Shareable public URLs for generated roadmaps

---

## � Changelog

### Recent Updates

| Date | Change | Description |
|------|--------|-------------|
| Apr 2025 | 🔥 **Firecrawl Integration** | AI roadmap generation now uses **Firecrawl** to fetch latest web resources (articles, videos, docs) for each topic |
| Apr 2025 | 🐛 **Explore Page Fix** | Fixed JSX rendering issue causing roadmaps not to display on Explore page |
| Apr 2025 | ⏳ **Progress Loading** | Added visual progress steps during roadmap generation (timer removed, steps kept) |
| Apr 2025 | 🔗 **Navbar Fix** | "Generate with AI" button now redirects to home page to ensure topic input |
| Apr 2025 | 🗄️ **SQLite Boolean Fix** | Fixed `is_published` filter logic for SQLite compatibility (`!= 0` instead of `== 1`) |
| Apr 2025 | 🔧 **Debug Scripts** | Added `check_db.py` and `fix_publish.py` for database debugging |

### Firecrawl Setup

To use the latest web resource feature:

```powershell
# Set environment variable
$env:FIRECRAWL_API_KEY="your-firecrawl-api-key"

# Or in .env file (backend/.env)
FIRECRAWL_API_KEY=your-firecrawl-api-key
```

## �📖 Glossary

| Term       | Definition                                                          |
| ---------- | ------------------------------------------------------------------- |
| Roadmap    | A visual, structured learning path for a topic                      |
| Node       | A single topic/step within a roadmap flowchart                      |
| Edge       | A connection line between two nodes                                 |
| React Flow | React library for building interactive node-based diagrams          |
| LangChain  | Framework for building LLM-powered applications                     |
| LLM        | Large Language Model (e.g., GPT-4)                                  |
| RAG        | Retrieval-Augmented Generation — AI retrieves docs before answering |
| JWT        | JSON Web Token — secure authentication token                        |
| FastAPI    | High-performance Python web framework for APIs                      |
| Zustand    | Lightweight React state management library                          |
| SerpAPI    | API for Google search results (YouTube, web)                        |

---

## 📞 Support

If you face any issues during setup:

1. Check Docker logs: `docker compose logs -f`
2. Check API docs: `http://localhost:8000/docs`
3. Raise an issue on GitHub

---

<div align="center">

**Built with ❤️ using AI**

`Next.js` • `React Flow` • `FastAPI` • `LangChain` • `PostgreSQL` • `Docker`

**Inspired by [roadmap.sh](https://roadmap.sh)**

</div>
