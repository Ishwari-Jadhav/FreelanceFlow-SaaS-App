# 🚀 FreelanceFlow

FreelanceFlow is a full-stack SaaS web application designed to help freelancers manage their clients, projects, tasks, time tracking, and invoices in one place.

---

## 📌 Features

### Client & Project Management
- Add, edit, delete clients
- Create projects linked to clients
- Manage tasks within projects

### Time Tracking
- Start/Stop timer for tasks
- Stores start and end time
- Automatically calculates duration

### Invoice Generation
- Select client + date range
- Fetch unbilled logs
- Calculate total (Duration × Hourly Rate)
- Generate downloadable PDF invoices

### Dashboard
- View total projects
- View tasks count
- Earnings overview

### Security
- JWT Authentication
- User-based data isolation

---

## Tech Stack

Frontend:
- React.js
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express.js

Database:
- PostgreSQL

Other Tools:
- PDFKit (for invoice generation)

---

## Project Structure

FreelanceFlow/
│
├─ frontend/
│
├─ backend/

---

## Setup Instructions

### 1. Clone Repository

git clone https://github.com/Ishwari-Jadhav/FreelanceFlow.git

### 2. Backend Setup

cd backend
npm install
npm run dev

### 3. Frontend Setup

cd frontend
npm install
npm run dev

---

## Demo Data

Use sample data:
- 1 Client
- 1 Project
- 1 Task
- 1 Time Log

---

## Invoice Logic

Total = Duration × Hourly Rate


---

## Project Objective

To simplify freelance workflow by combining:
- Task Management
- Time Tracking
- Invoice Generation

into a single platform.

---

## Developed By
Ishwari Pravin Jadhav