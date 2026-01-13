# Peer Voting System 🗳️

> **A Full-Stack Evaluation Platform for Student Cohorts.**
> *Secure, transparent, and interactive project voting with real-time leaderboards.*

![Stack](https://img.shields.io/badge/Stack-Full--Stack-blue) ![Status](https://img.shields.io/badge/Status-MVP_Ready-success) ![License](https://img.shields.io/badge/License-MIT-lightgrey)

## 📌 About the System
The **Peer Voting System** is a production-ready evaluation platform designed for **ALX students** to vote for peer projects. Unlike simple "like" buttons, this system implements a weighted, criteria-based rating system (Innovation, Design, Code Quality) to ensure fair judging.

It features a decoupled architecture with a **Django REST API** managing data/logic and a **React + Tailwind** frontend delivering a modern, responsive user experience.

---

## ✨ Key Features

### 🖥️ Frontend (React & Tailwind)
* **Interactive Dashboard:** Visual analytics showing voting status, rank, and community activity.
* **Live Leaderboard:** Real-time "Hall of Fame" podium ranking the top 3 projects.
* **Smart Search:** Instant filtering of projects by name or category.
* **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.

### ⚙️ Backend (Django & Redis)
* **Secure Auth:** JWT-based login/registration (HttpOnly cookies capable).
* **Voting Logic:** Enforces one vote per user per project.
* **Background Tasks:** Celery + Redis handle email notifications asynchronously.
* **Scheduled Jobs:** Celery Beat runs nightly cleanup scripts.

---

## 🛠 Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, shadcn/ui, Framer Motion, Axios |
| **Backend** | Python 3.11, Django 5, Django REST Framework (DRF) |
| **Database** | PostgreSQL (Production), SQLite (Dev) |
| **Async** | Redis, Celery, Celery Beat |
| **DevOps** | Docker, Docker Compose, Gunicorn, Whitenoise |

---

## 📁 Project Structure (Monorepo)

```text
voting-system/
├── backend/               # 🐍 Django API & Logic
│   ├── core/              # Main App (Views, Models, Tests)
│   ├── manage.py
│   ├── build.sh           # Render Deployment Script
│   └── requirements.txt
│
├── frontend/              # ⚛️ React UI
│   ├── src/               # Components & Pages
│   ├── package.json
│   └── vite.config.js
│
└── docker-compose.yaml    # Orchestration

🚀 Getting Started
Follow these instructions to run the full stack locally.

1️⃣ Backend Setup (Terminal A)

cd backend

# Create & Activate Virtual Env
python -m venv env
source env/Scripts/activate  # (Mac/Linux: source env/bin/activate)

# Install Dependencies
pip install -r requirements.txt

# Run Migrations & Start Server
python manage.py migrate
python manage.py runserver

Backend runs at: http://localhost:8000

2️⃣ Frontend Setup (Terminal B)
Bash

cd frontend

# Install Dependencies
npm install

# Start React Dev Server
npm run dev
Frontend runs at: http://localhost:5173

3️⃣ Background Workers (Optional)
Required only if you want to test email notifications locally.

Bash

docker compose up

Database Schema (ERD)
The system manages relationships between Users, Projects, and Criteria-based Ratings.

Plaintext

USER 1---∞ RATING ∞---1 PROJECT
          |
          ∞
       CRITERIA

# Run Backend Tests
cd backend
python manage.py test core

Deployment
Backend: Deployed on Render (using build.sh).

Frontend: Deployed on Vercel.

Database: Hosted on Neon / Render PostgreSQL.

👤 Author
Wandile

Full Stack Software Engineer

SaaS & MVP Developer