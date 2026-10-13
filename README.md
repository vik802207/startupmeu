# TalentFlow — Modern Startup Applicant Tracking System (ATS)

> Built for the **Software Engineer Intern – MERN Stack** technical assessment at **StartupMeu**.

[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node.js-6366f1.svg)](#technologies-used)
[![Development Workflow](https://img.shields.io/badge/Workflow-Code0%20AI%20Assisted-10b981.svg)](#code0-development-workflow-confirmation)
[![Architecture](https://img.shields.io/badge/Architecture-Dual--Mode%20Zero--Config%20Database-f59e0b.svg)](#database-dual-mode-feature)

---

## 📌 Project Overview

**TalentFlow** is a modern, high-performance Applicant Tracking System (ATS) designed for high-growth startups to streamline hiring operations, candidate evaluations, and talent pipeline velocity. 

Startups need fast, collaborative, and data-driven hiring workflows. TalentFlow provides:
- An interactive **7-stage Kanban recruitment pipeline**.
- Structured candidate evaluation **scorecards** across 4 key dimensions (Technical, Problem Solving, Communication, Culture Fit).
- Real-time **recruitment analytics & conversion funnels** powered by MongoDB aggregation pipelines.
- An intuitive job requisition manager with applicant volume counters.
- **Zero-config dual-mode database**: Runs out-of-the-box using built-in in-memory MongoDB with pre-seeded startup candidate profiles, or easily connects to MongoDB Atlas via `.env`.

---

## ✨ Key Features

1. **Interactive Kanban Recruitment Pipeline**:
   - Visual 7-stage workflow: *Applied → Screening → Technical Round → Culture Fit → Offer Extended → Hired → Rejected*.
   - One-click stage transitions with instant optimistic UI updates and live audit trail.
   - Live filtering by target job position, candidate name/skills search, and star rating.

2. **Candidate Evaluation Scorecard & Profile Modal**:
   - Multi-metric evaluation (Technical Proficiency, Problem Solving, Communication, Culture Fit).
   - Weighted average score computation updated dynamically on the backend.
   - Collaborative interviewer feedback notes thread with author timestamps.
   - Comprehensive audit timeline tracking all applicant stage transitions.

3. **Startup Requisition & Job Openings Manager**:
   - Create, browse, and manage open positions (Full-time, Internship, Contract).
   - Real-time applicant metrics (total applicants and active in-process count per role).
   - Filter board candidates directly by clicking on any job role.

4. **Hiring Analytics & Funnel Dashboard**:
   - Stage conversion funnel visualization.
   - Top skills frequency analysis in candidate pool via MongoDB `$unwind` aggregation.
   - Department breakdown of active positions and talent volume.
   - Recent recruitment activity stream.

5. **Reviewer-Friendly Demo Reset**:
   - "Demo Data" button in the navigation header allows reviewers to reload the realistic seed dataset in 1 click at any time.

---

## 🛠️ Technologies Used

### Frontend
- **React.js 18** (Modern functional components, hooks: `useState`, `useEffect`, `useMemo`)
- **Vite** (Lightning-fast HMR and proxy configuration)
- **Vanilla CSS & Modern Design Tokens** (Glassmorphism, dark palette, smooth micro-transitions, responsive layouts)
- **Lucide React** (Clean, modern iconography)
- **Google Fonts** (*Outfit* for bold headings, *Plus Jakarta Sans* for clean UI readability)

### Backend
- **Node.js** (JavaScript runtime)
- **Express.js** (REST API framework with modular routing and controllers)
- **MongoDB & Mongoose 8** (Schema modeling, indexing, compound text indexes, aggregation pipelines)
- **MongoMemoryServer** (Zero-config embedded MongoDB fallback for seamless reviewer evaluation)
- **CORS & Morgan** (Cross-origin support and request logging)

---

## 💻 Code0 Development Workflow Confirmation

> **Confirmation:** This project was developed following StartupMeu's engineering workflow using **[Code0](https://marketplace.visualstudio.com/items?itemName=frigga.code0)** for AI-assisted software engineering. All architectural designs, API implementations, database integrations, debugging steps, and Git operations were conducted within the Code0 development environment.

---

## 🤖 AI Development Experience with Code0

Using Code0 throughout the development cycle significantly accelerated development velocity while allowing me to maintain full technical ownership over architectural decisions, data validation, and UX polish. 

Rather than treating AI output as a black box, Code0 was used as an interactive pair programmer: proposing solutions, scaffolding repetitive boilerplate, generating complex MongoDB aggregation pipelines, and diagnosing subtle edge cases.

### 4 Specific Tasks Where Code0 Assisted:

#### 1. REST API Architecture & Controller Implementation
- **Challenge:** Needed a clean, maintainable MVC architecture for candidate CRUD, note appending, scorecard updates, and job management.
- **Code0 Contribution:** Scaffolded Express router endpoints and controller methods. Suggested handling stage updates with a dedicated lightweight `PATCH /api/candidates/:id/stage` endpoint that atomically appends to the audit timeline, avoiding overhead from full document replacements.
- **My Validation:** Reviewed Mongoose validation checks, ensured HTTP status codes (201 for creation, 400 for bad input, 404 for missing records), and verified that invalid MongoDB ObjectIds are trapped cleanly.

#### 2. Advanced MongoDB Aggregation Pipelines for Analytics
- **Challenge:** Generating real-time recruitment metrics (candidate conversion funnel, top skills in talent pool, department distribution) without performing inefficient multiple in-memory JavaScript loops.
- **Code0 Contribution:** Assisted in crafting multi-stage aggregation pipelines:
  - `$unwind` on candidate `skills` array followed by `$group` and `$sort` for top skills intelligence.
  - `$lookup` joining `jobs` with `candidates` to calculate active applicants per job.
- **My Validation:** Tested pipeline execution and added `$cond` logic to ensure hired and rejected candidates are separated from active pipeline volume.

#### 3. Zero-Config Dual-Mode Database Fallback
- **Challenge:** Evaluators and hiring managers often don't have a local `mongod` service running or want to avoid setting up MongoDB Atlas credentials just to test a submission.
- **Code0 Contribution:** Proposed and implemented a dual-mode database connector in `server/src/config/db.js`. If `MONGODB_URI` is absent or connection fails, the server seamlessly spins up an in-memory MongoDB instance (`mongodb-memory-server`) and triggers an automatic seed routine.
- **My Validation:** Tested both paths: connected to a live MongoDB instance, and verified that removing `.env` smoothly boots into in-memory mode without errors.

#### 4. Frontend Component State & Optimistic UI Updates
- **Challenge:** The Kanban pipeline requires instant feedback when dragging or changing candidate stages without jarring UI delays.
- **Code0 Contribution:** Helped structure state management in `App.jsx`, implementing optimistic UI updates: local state updates immediately, and reverts gracefully if the network request fails, accompanied by a toast notification.
- **My Validation:** Refined search filtering using `useMemo` across multiple candidate attributes (name, company, education, skills) to keep filtering instantaneous.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+ (tested on npm v11)
- *Optional:* MongoDB Atlas connection string (not required, thanks to built-in fallback)

### Step 1: Clone the Repository
```bash
git clone <YOUR_PUBLIC_GITHUB_REPO_URL>
cd Startupmenu
```

### Step 2: Install Dependencies
You can install dependencies for both server and client with a single command:
```bash
npm run install:all
```
*(Alternatively, run `npm install` inside the `server/` directory and `npm install` inside the `client/` directory).*

### Step 3: Environment Configuration (Optional)
A default `server/.env` is already provided. If you want to use your own MongoDB Atlas cluster:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/talentflow
CLIENT_URL=http://localhost:5173
```
*If `MONGODB_URI` is left blank, the application will automatically run using the embedded zero-config database with pre-seeded data.*

---

## 🏃 Instructions to Run the Application

### Option A: Run Both Frontend & Backend Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Option B: Run Services Separately
**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

---

## 📂 Project Directory Structure

```
Startupmenu/
├── package.json               # Root scripts (concurrently dev, install:all)
├── .gitignore                 # Root gitignore
├── README.md                  # Complete project documentation
│
├── server/                    # Express & MongoDB Backend
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── config/
│       │   └── db.js          # Dual-mode DB connector (Atlas + In-Memory)
│       ├── models/
│       │   ├── Candidate.js   # Candidate schema, scorecards, audit trail
│       │   └── Job.js         # Job requisitions schema with virtuals
│       ├── controllers/
│       │   ├── candidateController.js
│       │   ├── jobController.js
│       │   └── analyticsController.js # Aggregation pipelines
│       ├── routes/
│       │   ├── candidateRoutes.js
│       │   ├── jobRoutes.js
│       │   ├── analyticsRoutes.js
│       │   └── seedRoutes.js
│       ├── seed/
│       │   ├── seedData.js    # Realistic candidate & startup job dataset
│       │   └── seeder.js      # Auto-seed logic & reset endpoint
│       ├── middleware/
│       │   └── errorHandler.js# Centralized error handler
│       └── server.js          # Main Express server entrypoint
│
└── client/                    # React + Vite Frontend
    ├── package.json
    ├── vite.config.js         # Vite configuration with proxy to port 5000
    ├── index.html             # HTML5 template with Google Fonts
    └── src/
        ├── styles/
        │   └── index.css      # Design tokens, glassmorphism, responsive styles
        ├── services/
        │   └── api.js         # Centralized API service
        ├── components/
        │   ├── Navbar.jsx     # Header with tabs and quick seed trigger
        │   ├── StatsOverview.jsx # Key metrics cards
        │   ├── PipelineBoard.jsx # 7-stage Kanban pipeline board
        │   ├── CandidateTable.jsx# List view with sorting and filters
        │   ├── JobManager.jsx # Startup job openings manager
        │   ├── AnalyticsView.jsx # Visual hiring funnel and skill breakdown
        │   ├── CandidateModal.jsx# Profile, scorecards, notes, and timeline
        │   ├── NewCandidateModal.jsx # Add applicant form
        │   ├── NewJobModal.jsx# Post job form
        │   └── Toast.jsx      # Feedback toast notifications
        ├── App.jsx            # State orchestration and view switches
        └── main.jsx           # React DOM root entry
```

---

## 🧪 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and uptime |
| `GET` | `/api/candidates` | List candidates with search, stage, role filters |
| `POST` | `/api/candidates` | Create candidate application |
| `GET` | `/api/candidates/:id` | Get single candidate with job populated |
| `PUT` | `/api/candidates/:id` | Update candidate details |
| `PATCH`| `/api/candidates/:id/stage` | Update candidate pipeline stage |
| `POST` | `/api/candidates/:id/notes` | Add interviewer feedback note |
| `PUT` | `/api/candidates/:id/scorecard` | Update 4-metric evaluation scores |
| `DELETE`| `/api/candidates/:id` | Delete candidate profile |
| `GET` | `/api/jobs` | List jobs with active candidate count |
| `POST` | `/api/jobs` | Create new job requisition |
| `GET` | `/api/analytics` | Aggregation metrics (funnel, skills, departments) |
| `POST` | `/api/seed/reset` | Reset demo data to fresh initial state |

---

## 👨‍💻 Candidate Submission Notes

- **Candidate Background:** B.Tech from IIIT Nagpur with full-stack experience (React.js, Node.js, REST APIs).
- **Position Applied:** Software Engineer Intern – MERN Stack @ StartupMeu.
- **Workflow:** Code0 AI-Assisted Development with complete validation of generated code.
