# Smart Agriculture Production System

This is a full-stack smart agriculture management application designed to track farm metrics, manage jobs, and provide AI-driven crop yield predictions.

## 🏗️ Architecture & Project Structure

The repository is divided into three distinct microservices/components to handle the user interface, datastore, and predictive analysis.

### 1. `frontend` (React + Vite)
- **Tech Stack:** React 19, Vite, TailwindCSS, Recharts, Framer Motion.
- **Description:** Provides the user dashboard, displaying agricultural metrics and sensor data visualizations. 
- **Start Command:** `npm install` -> `npm run dev` (Runs on `http://localhost:5173`)

### 2. `backend-api` (Node.js API & Database Service)
- **Tech Stack:** Node.js, Express, jsonwebtoken, bcryptjs.
- **Description:** The primary API server handling user authentication (`/api/auth`), connected sensors (`/api/sensors`), and task jobs (`/api/jobs`). 
- **Database:** It uses a zero-setup local JSON database (`db.json`) as a mock for Mongoose to store user/sensor data natively.
- **Configuration:** Requires an `.env` file containing `PORT=5000` and a `JWT_SECRET`.
- **Start Command:** `npm install` -> `npm run dev` (Runs on `http://localhost:5000`)

### 3. `backend-ai` (Python AI Service)
- **Tech Stack:** Python, Flask, Pandas, Scikit-Learn.
- **Description:** A purely predictive machine learning microservice. It exposes a single main endpoint `/predict-yield` that accepts POST requests containing environmental conditions (`soilPh`, `moisture`, `temperature`, `n`, `p`, `k`) and calculates an expected yield in tons/hectare.
- **Start Command:** `pip install -r requirements.txt` -> `python app.py` (Runs on `http://localhost:5001`)

## 🚀 Getting Started

To run the whole stack concurrently, open three terminals in the root directory and execute the following:

**Terminal 1 (Node API):**
```bash
cd backend-api
npm install
npm run dev
```

**Terminal 2 (Python AI):**
```bash
cd backend-ai
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Terminal 3 (React UI):**
```bash
cd frontend
npm install
npm run dev
```

Once started, point your browser to `http://localhost:5173` to access the application.
