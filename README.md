# Oracle COE – AI-Powered Job Portal

An enterprise-grade job portal built to connect Oracle professionals with top recruiters using intelligent resume screening, AI-powered job matching, and gamified engagement.

---

## 🌐 Project Overview

The Oracle COE Job Portal is a modern, AI-integrated SaaS platform built for:
- **Candidates** looking for Oracle-related jobs
- **Recruiters** managing Oracle-specific hiring pipelines
- **Admins** overseeing platform health, moderation, and analytics

---

## 🔧 Tech Stack

| Layer           | Technology                      |
|----------------|----------------------------------|
| Frontend        | Angular                          |
| Backend API     | NestJS (Node.js)                 |
| AI Microservice | FastAPI (Python)                 |
| Database        | MySQL                            |
| DevOps          | Docker, GitHub Actions           |
| Hosting         | Cloud (optional: AWS, Render)    |

---

## 🧱 Modules & Features

### 👤 Candidate Module
- Profile builder with resume upload
- Skill tagging and certification management
- AI-based job recommendations
- Resume score + behavioral fit score
- Apply, save, and track job applications
- Referral tracking and reward points

### 👔 Recruiter Module
- Post and manage Oracle job listings
- View & filter candidate applications
- AI-powered candidate scoring
- Team access and recruiter collaboration
- Subscription and usage tracking

### 🛠️ Admin Panel
- Manage users, jobs, and system statuses
- Content moderation for flagged resumes/jobs
- Reward engine management (points + badges)
- Analytics dashboard and DEI filters
- API token control for integrations

---

## 🧠 AI Engine Features (Python + FastAPI)

- Resume Parsing (PDF/DOCX)
- Resume Quality Scoring
- Job-Candidate Skill Matching
- Behavioral Fit Scoring (based on traits/quiz)

---

## 🗂 Database Design

- 20+ normalized tables including:
  - `users`, `roles`, `statuses`, `job_posts`, `applications`
  - `candidate_profiles`, `skills`, `referrals`, `subscriptions`
  - `activity_logs`, `badges`, `user_badges`, `admin_users`

Refer to the ERD and schema documentation for full structure.

---

## 🧪 Testing & Quality

- Unit tests for backend & AI modules
- Linting and formatting with ESLint + Prettier
- CI pipelines with GitHub Actions
- Prisma migration enforcement on schema changes

---

## 📦 Deployment (Optional Reference)

- Frontend: Deployed via Vercel / S3
- Backend: Node service on EC2 / Render
- AI Engine: FastAPI Docker container or Lambda
- Database: RDS MySQL
- All services containerized for local dev with Docker Compose

---

## 📚 Documentation

- Database Schema (ERD)
- API Contracts (Swagger/OpenAPI)
- Module-wise Readme (Frontend, Backend, AI)
- Admin & User Manuals (optional)

---

## 👥 Core Team

- **Rajasekhar** – Solution Architect & Product Owner
- **Pinkesh** – Fullstack Developer
- **Keerthi** – Fullstack Developer
- **Kiran** – UI/UX Designer

---

## 🚀 Vision

To enable 1 lakh Oracle professionals to land their dream jobs by using AI, community referrals, and structured job readiness support via the Oracle COE platform.
