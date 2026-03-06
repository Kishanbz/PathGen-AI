# PathGen-AI 🎓 AI-Powered Personalized Learning Path System 

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Development Timeline](#-development-timeline-12-weeks)
- [User Roles](#-user-roles)
- [Non-Functional Requirements](#-non-functional-requirements)
- [Risk & Mitigation](#-risk--mitigation)
- [Success Metrics](#-success-metrics)
- [Glossary](#-glossary)
- [License](#-license)

---

## 🚀 Project Overview

The **AI-Powered Personalized Learning Path System** is an intelligent EdTech platform that uses Artificial Intelligence and Machine Learning to understand each learner's strengths, weaknesses, goals, and learning style — then dynamically creates a **personalized learning path** that continuously adapts over time.

Unlike traditional one-size-fits-all platforms like Coursera or Udemy, this system makes education **truly personal, predictive, and performance-driven.**

| Attribute | Details |
|---|---|
| Project Name | AI-Powered Personalized Learning Path System |
| Project Category | AI + Data Science + EdTech |
| Project Type | College Final Year Submission |
| Development Duration | 3 Months (12 Weeks) |
| Team Size | 2–4 Developers |
| Core Technologies | Python, React.js, PostgreSQL, MinIO, LangChain, Docker |
| Primary Users | Students, Teachers, Admins |
| Deployment | Cloud / Local Docker Environment |

---

## ❗ Problem Statement

Traditional learning systems suffer from:

- ❌ **One-size-fits-all curriculum** — every student follows the same path regardless of ability or pace
- ❌ **No real-time performance tracking** — teachers and students don't get instant actionable feedback
- ❌ **Lack of personalization** — courses are static and don't adapt to individual progress
- ❌ **High dropout rates** — learners lose motivation when content is too easy or too difficult
- ❌ **No predictive guidance** — students don't know which skills to focus on for their goals
- ❌ **Manual assessment overload** — teachers spend excessive time evaluating student performance

### Market Gap
Existing platforms provide content but **do not intelligently adapt** learning journeys based on real-time performance data. This system solves that.

---

## ✅ Features

### 🎯 Core Features
| Feature | Description |
|---|---|
| 🔐 Role-based Auth | Student, Teacher, Admin login with JWT |
| 📝 Initial Assessment | Diagnostic quiz to evaluate knowledge & learning style |
| 🤖 AI Learning Path | ML model creates personalized curriculum per student |
| 📁 Content Management | Upload PDFs, videos, quizzes stored in MinIO/S3 |
| 📊 Progress Tracker | Real-time tracking of completed topics, scores, time spent |
| 💡 AI Recommendation | Suggests next best content based on performance patterns |
| 🔮 Performance Prediction | ML model predicts future scores & identifies weak areas |
| 🤖 AI Chatbot | LangChain RAG chatbot answers student questions |
| 📄 Auto Reports | Weekly AI-generated PDF performance reports |
| 🛠️ Admin Dashboard | System management, user management, analytics |

### 📌 Out of Scope
- Live video streaming / virtual classrooms
- Mobile native app (iOS/Android) — web PWA only
- Payment gateway / subscriptions
- Third-party LMS integration

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js + Tailwind CSS | UI, dashboards, learning pages |
| Frontend Charts | Recharts / Chart.js | Performance graphs, progress visualization |
| Backend API | Python FastAPI | Core REST API for all modules |
| Task Queue | Celery + Redis | Background AI processing, report generation |
| AI / ML | Scikit-learn + XGBoost | Performance prediction, learning path models |
| NLP / LLM | LangChain + OpenAI GPT | AI chatbot, content tagging, recommendations |
| Vector Search | FAISS | Semantic search for RAG-based chatbot |
| Object Storage | MinIO (S3-compatible) | Store PDFs, videos, reports, content files |
| Database | PostgreSQL | Users, courses, performance, chat history |
| Caching | Redis | Session caching, API response caching |
| Containerization | Docker + Docker Compose | Service orchestration and deployment |
| PDF Generation | ReportLab / WeasyPrint | Auto-generate performance reports |
| Authentication | JWT + OAuth2 | Secure user authentication |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│              PRESENTATION LAYER                  │
│         React.js Dashboard (Student /            │
│              Teacher / Admin)                    │
└────────────────────┬────────────────────────────┘
                     │ HTTP / REST
┌────────────────────▼────────────────────────────┐
│              API GATEWAY                         │
│           FastAPI + Nginx                        │
│      (Auth, Rate Limiting, Routing)              │
└────────────────────┬────────────────────────────┘
          ┌──────────┼──────────┐
          ▼          ▼          ▼
┌──────────────┐ ┌────────┐ ┌──────────────┐
│  Business    │ │   AI   │ │    Task      │
│   Logic      │ │ Engine │ │  Processing  │
│ FastAPI      │ │ML+Lang │ │Celery+Redis  │
│ Routers      │ │ Chain  │ │              │
└──────┬───────┘ └───┬────┘ └──────┬───────┘
       │              │             │
┌──────▼──────────────▼─────────────▼───────┐
│              STORAGE LAYER                 │
│    PostgreSQL (DB)  +  MinIO (Files)       │
└────────────────────────────────────────────┘
```

### Data Flow
1. Student logs in → JWT issued → Role-based dashboard loaded
2. Initial assessment taken → AI Engine analyzes → Learning path generated → Saved in PostgreSQL
3. Student accesses content → Files retrieved from MinIO → Progress tracked in PostgreSQL
4. Quiz completed → Score analyzed → ML model updates prediction → Recommendation engine suggests next topic
5. Weekly batch job (Celery) → Generates PDF report → Saved to MinIO → Notification sent

---

## 📁 Project Structure

```
ai-learning-path-system/
│
├── frontend/                          # React.js Application
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx              # Auth pages
│   │   │   ├── Dashboard.jsx          # Student dashboard
│   │   │   ├── Assessment.jsx         # Initial quiz
│   │   │   ├── LearningPath.jsx       # Personalized path view
│   │   │   ├── TopicPage.jsx          # Individual topic content
│   │   │   ├── ChatBot.jsx            # AI chatbot UI
│   │   │   ├── Reports.jsx            # Performance reports
│   │   │   ├── TeacherDashboard.jsx   # Teacher analytics
│   │   │   └── AdminPanel.jsx         # Admin management
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProgressChart.jsx
│   │   │   ├── PathCard.jsx
│   │   │   └── RecommendationCard.jsx
│   │   ├── services/
│   │   │   └── api.js                 # Axios API calls
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                           # FastAPI Application
│   ├── routes/
│   │   ├── auth.py                    # Login, register, JWT
│   │   ├── assessment.py              # Quiz submission & scoring
│   │   ├── learning_path.py           # AI path endpoints
│   │   ├── content.py                 # Upload/fetch content
│   │   ├── progress.py                # Track student progress
│   │   ├── recommendations.py         # AI recommendations
│   │   ├── predictions.py             # ML performance predictions
│   │   ├── chat.py                    # Chatbot API
│   │   ├── reports.py                 # Report generation
│   │   └── admin.py                   # Admin endpoints
│   ├── models/
│   │   └── db_models.py               # SQLAlchemy ORM models
│   ├── schemas/
│   │   └── pydantic_schemas.py        # Request/response schemas
│   ├── core/
│   │   ├── config.py                  # Environment config
│   │   ├── security.py                # JWT & password hashing
│   │   └── database.py                # DB connection
│   ├── tasks/
│   │   └── celery_tasks.py            # Background jobs
│   └── main.py                        # FastAPI entry point
│
├── ai_engine/                         # AI & ML Core
│   ├── path_generator.py              # Learning path ML model
│   ├── predictor.py                   # XGBoost performance predictor
│   ├── recommender.py                 # Recommendation engine
│   ├── chatbot.py                     # LangChain RAG chatbot
│   ├── content_tagger.py              # Auto-tag uploaded content
│   └── model_training/
│       ├── train_predictor.py         # Train XGBoost model
│       ├── train_recommender.py       # Train recommendation model
│       └── sample_data/               # Sample training data
│
├── storage/                           # MinIO Integration
│   ├── storage_manager.py             # Upload, download, delete files
│   └── bucket_setup.py                # Initialize MinIO buckets
│
├── database/                          # Database Management
│   ├── migrations/                    # Alembic migration files
│   ├── seed_data.py                   # Sample data for testing
│   └── queries.py                     # Reusable DB queries
│
├── reports/                           # PDF Report Generation
│   ├── report_generator.py            # ReportLab PDF builder
│   └── templates/                     # Report templates
│
├── docker-compose.yml                 # Full system orchestration
├── Dockerfile.backend                 # Backend Docker image
├── Dockerfile.frontend                # Frontend Docker image
├── requirements.txt                   # Python dependencies
├── .env.example                       # Environment variables template
├── .gitignore
└── README.md                          # This file
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
    role        VARCHAR(20) NOT NULL,          -- student / teacher / admin
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Courses Table
CREATE TABLE courses (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    subject     VARCHAR(100),
    difficulty  VARCHAR(20),                   -- beginner / intermediate / advanced
    teacher_id  INTEGER REFERENCES users(id),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Topics Table
CREATE TABLE topics (
    id              SERIAL PRIMARY KEY,
    course_id       INTEGER REFERENCES courses(id),
    title           VARCHAR(200) NOT NULL,
    order_index     INTEGER,
    estimated_time  INTEGER                    -- in minutes
);

-- Content Files Table (linked to MinIO)
CREATE TABLE content_files (
    id          SERIAL PRIMARY KEY,
    topic_id    INTEGER REFERENCES topics(id),
    file_type   VARCHAR(20),                   -- pdf / video / quiz
    minio_key   VARCHAR(300),                  -- MinIO object key
    metadata    JSONB,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Learning Paths Table (AI Generated)
CREATE TABLE learning_paths (
    id                  SERIAL PRIMARY KEY,
    student_id          INTEGER REFERENCES users(id),
    course_id           INTEGER REFERENCES courses(id),
    ai_generated_order  JSONB,                 -- ordered topic IDs from AI
    status              VARCHAR(20),           -- active / completed
    created_at          TIMESTAMP DEFAULT NOW()
);

-- Progress Table
CREATE TABLE progress (
    id           SERIAL PRIMARY KEY,
    student_id   INTEGER REFERENCES users(id),
    topic_id     INTEGER REFERENCES topics(id),
    score        FLOAT,
    time_spent   INTEGER,                      -- in minutes
    completed_at TIMESTAMP
);

-- AI Predictions Table
CREATE TABLE predictions (
    id               SERIAL PRIMARY KEY,
    student_id       INTEGER REFERENCES users(id),
    topic_id         INTEGER REFERENCES topics(id),
    predicted_score  FLOAT,
    confidence       FLOAT,
    created_at       TIMESTAMP DEFAULT NOW()
);

-- AI Recommendations Table
CREATE TABLE recommendations (
    id          SERIAL PRIMARY KEY,
    student_id  INTEGER REFERENCES users(id),
    topic_id    INTEGER REFERENCES topics(id),
    reason      TEXT,
    score       FLOAT,
    shown_at    TIMESTAMP DEFAULT NOW()
);

-- Chat History Table
CREATE TABLE chat_history (
    id          SERIAL PRIMARY KEY,
    student_id  INTEGER REFERENCES users(id),
    session_id  VARCHAR(100),
    message     TEXT,
    response    TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Reports Table (linked to MinIO)
CREATE TABLE reports (
    id           SERIAL PRIMARY KEY,
    student_id   INTEGER REFERENCES users(id),
    period       VARCHAR(50),                  -- e.g. "Week 1 - Feb 2025"
    minio_key    VARCHAR(300),
    generated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & receive JWT token |
| POST | `/api/auth/reset-password` | Password reset via email |

### Assessment
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/assessment/questions` | Get diagnostic quiz questions |
| POST | `/api/assessment/submit` | Submit quiz & trigger AI path generation |

### Learning Path
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/learning-path/{student_id}` | Get personalized learning path |
| PUT | `/api/learning-path/{student_id}/update` | Update path after performance change |

### Content
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/content/upload` | Upload file to MinIO (Teacher only) |
| GET | `/api/content/{topic_id}` | Get all content for a topic |
| DELETE | `/api/content/{file_id}` | Delete content file |

### Progress
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/progress/update` | Update student progress after topic |
| GET | `/api/progress/{student_id}` | Get full progress history |

### AI Features
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/recommendations/{student_id}` | Get AI topic recommendations |
| GET | `/api/predictions/{student_id}` | Get AI performance predictions |
| POST | `/api/chat/message` | Send message to AI chatbot |
| GET | `/api/chat/history/{student_id}` | Get chat history |

### Reports & Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/{student_id}` | List all reports for a student |
| POST | `/api/reports/generate/{student_id}` | Manually trigger report generation |
| GET | `/api/admin/analytics` | Platform-wide analytics |
| GET | `/api/admin/users` | List all users |

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have the following installed:

```bash
# Check versions
node --version        # v18+
python --version      # 3.10+
docker --version      # 24+
docker compose version # 2.0+
```

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-learning-path-system.git
cd ai-learning-path-system
```

### 2. Copy Environment Variables
```bash
cp .env.example .env
# Edit .env with your actual values (see Environment Variables section)
```

### 3. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# ─── Database ───────────────────────────────
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_learning_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=ai_learning_db

# ─── JWT Auth ───────────────────────────────
SECRET_KEY=your_super_secret_jwt_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ─── MinIO Object Storage ───────────────────
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_CONTENT=course-content
MINIO_BUCKET_REPORTS=student-reports
MINIO_SECURE=false

# ─── Redis & Celery ─────────────────────────
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# ─── OpenAI (for LangChain Chatbot) ─────────
OPENAI_API_KEY=sk-your-openai-api-key-here

# ─── Email (for notifications) ──────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASSWORD=your_app_password

# ─── Frontend ───────────────────────────────
VITE_API_BASE_URL=http://localhost:8000
```

---

## ▶️ Running the Project

### Option 1: Docker Compose (Recommended — runs everything)

```bash
# Start all services in one command
docker compose up --build

# Services started:
# ✅ Frontend     → http://localhost:3000
# ✅ Backend API  → http://localhost:8000
# ✅ API Docs     → http://localhost:8000/docs
# ✅ PostgreSQL   → localhost:5432
# ✅ MinIO        → http://localhost:9001  (admin console)
# ✅ Redis        → localhost:6379
```

### Option 2: Manual Run (Development)

**Terminal 1 — Backend API**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Celery Worker**
```bash
cd backend
celery -A tasks.celery_tasks worker --loglevel=info
```

**Terminal 3 — Frontend**
```bash
cd frontend
npm run dev
```

**Terminal 4 — MinIO**
```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

**Terminal 5 — PostgreSQL**
```bash
docker run -p 5432:5432 \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=ai_learning_db \
  postgres:15
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

| Week | Tasks | Deliverable |
|---|---|---|
| Week 1 | Project setup, Docker config, DB schema design, MinIO bucket setup | Working dev environment |
| Week 2 | User auth (JWT), role-based access, Student/Teacher/Admin API routes | Login & auth system |
| Week 3 | Initial assessment module — quiz UI, backend scoring, AI path generator v1 | Assessment + basic path |
| Week 4 | Content upload system — MinIO integration, file management API, teacher UI | Content management |

### 🤖 Month 2 — AI Engine & Core Features (Weeks 5–8)

| Week | Tasks | Deliverable |
|---|---|---|
| Week 5 | XGBoost performance prediction model — train, evaluate, integrate API | Prediction engine |
| Week 6 | AI recommendation engine — collaborative filtering + content-based logic | Smart recommendations |
| Week 7 | LangChain RAG chatbot — FAISS vector store, course content indexing, chat API | AI chatbot |
| Week 8 | Progress tracking — real-time updates, adaptive path adjustment logic | Dynamic learning path |

### 🎨 Month 3 — Frontend, Reports & Deployment (Weeks 9–12)

| Week | Tasks | Deliverable |
|---|---|---|
| Week 9 | React.js student dashboard — path UI, progress charts, topic pages | Student dashboard |
| Week 10 | Teacher dashboard — student analytics, at-risk alerts, content management UI | Teacher dashboard |
| Week 11 | PDF report generation, Celery scheduling, admin panel, system testing | Reports + Admin |
| Week 12 | Bug fixes, optimization, Docker deployment, documentation, demo prep | Final submission ✅ |

---

## 👥 User Roles

| Role | Description | Key Access |
|---|---|---|
| **Student** | Primary learner | Personalized path, progress, AI chatbot, reports |
| **Teacher** | Content creator | Upload content, view student analytics, get alerts |
| **Admin** | System manager | User management, system health, platform analytics |

### Login Credentials (After Seeding)
```
Admin:   admin@test.com    / admin123
Teacher: teacher@test.com  / teacher123
Student: student@test.com  / student123
```

---

## 📊 Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | API response time < 2 seconds |
| Scalability | Supports 500 concurrent users |
| Security | bcrypt passwords, JWT expiry 24h, HTTPS |
| Availability | 99% uptime target |
| AI Explainability | Every recommendation shows reason |
| Usability | Responsive PWA — works on mobile |
| Maintainability | Docker containers for easy updates |

---

## ⚠️ Risk & Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| AI model accuracy low with limited data | Medium | High | Use pre-trained models + synthetic training data |
| OpenAI API cost overrun | Medium | Medium | Set token limits; use local LLM (Ollama) as fallback |
| Feature scope creep | High | High | Strictly follow 12-week timeline |
| MinIO storage issues | Low | Medium | Async upload with Celery + file size limits |
| DB performance under load | Low | Medium | Add PostgreSQL indexes on key fields |
| Team ML skill gaps | Medium | High | Use Scikit-learn; follow Kaggle tutorials |

---

## 🎯 Success Metrics

### Technical
- [x] All 12+ API endpoints working and tested via Swagger
- [x] AI path generation completes within 3 seconds
- [x] Prediction model achieves ≥75% accuracy on test data
- [x] File upload/download from MinIO working
- [x] `docker compose up` starts entire system in one command

### Functional
- [x] Full student journey: Register → Assess → Get Path → Learn → Get Recommendation
- [x] Teacher can upload content and view student analytics
- [x] AI chatbot answers questions from course content
- [x] Weekly PDF reports auto-generated and downloadable
- [x] Admin panel shows real-time platform statistics

---

## 📖 Glossary

| Term | Definition |
|---|---|
| AI | Artificial Intelligence — machines performing tasks requiring human-like intelligence |
| ML | Machine Learning — AI that learns from data without explicit programming |
| LLM | Large Language Model — AI trained on vast text data (e.g. GPT-4) |
| RAG | Retrieval-Augmented Generation — AI retrieves relevant docs before answering |
| FAISS | Facebook AI Similarity Search — vector database for semantic search |
| LangChain | Framework for building LLM-powered apps with tools and memory |
| MinIO | Open-source S3-compatible object storage |
| JWT | JSON Web Token — secure authentication token |
| FastAPI | High-performance Python web framework for APIs |
| Docker | Platform to build and run apps in containers |
| Celery | Distributed task queue for async background jobs |
| XGBoost | Extreme Gradient Boosting — powerful ML algorithm for predictions |
| FAISS | Vector similarity search library by Facebook AI |
| PRD | Product Requirements Document |

---

## 📞 Support

If you face any issues during setup:

1. Check Docker logs: `docker compose logs -f`
2. Check API docs: `http://localhost:8000/docs`
3. Check MinIO console: `http://localhost:9001`
4. Raise an issue on GitHub

---

## 📄 License

This project is created for **educational purposes** as a College Final Year Project.

---

<div align="center">

**Built with ❤️ using AI + Data Science**

`Python` • `React.js` • `PostgreSQL` • `MinIO` • `LangChain` • `Docker`

</div>
