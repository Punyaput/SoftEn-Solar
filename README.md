# ☀️ SoftEn Solar

## CN334 Web Application Development  
### SDG 7 - Affordable and Clean Energy ♻️

**SoftEn Solar** is an e-commerce web application that promotes sustainability by selling solar-powered products. It was developed as part of the CN334 Web Application Development course, aligning with [ Sustainable Development Goal 7: Affordable and Clean Energy.](https://sdgs.un.org/goals/goal7)

---

## ⚪ Visit our Applicaion deployed on Render
- [SoftEn-Solar Web Application](https://soften-solar-frontend.onrender.com)

---

## 🛠️ Tech Stack

- 🐍 **Backend:** Django (Django REST Framework)
- ⚛️ **Frontend:** Next.js (React)
- 🗄️ **Database:**  
  - `sqlite3` (local development)  
  - `PostgreSQL` (production by Render Postgres service)
- 🐳 **Docker:** Containerization setup (REQUIRED for local development)

---

## 🚀 Features

- User signup system
- User authentication with tokens/session
- User dashoard
- Sun Point reward system (daily login bonus)
- Product listings, cart system, and checkout
- Sustainability scores on products & product properties
- Admin dashboard (optional)

---

## 🧑‍💻 Local Development Setup

### 🔹 1. Clone the `dev` branch

```bash
git clone -b dev https://github.com/Punyaput/SoftEn-Solar
cd SoftEn-Solar
```

### 🔹 2. 📝 Create placeholder .env files (their values will resolve to default during development) and empty db.sqlite3 file
- Create a new file `.env` in `SoftEn-Solar/backend/` directory
- Create a new file `db.sqlite3` in `SoftEn-Solar/backend/` directory
- Create a new file `.env.docker` in `SoftEn-Solar/frontend/` directory

### 🔹 3. Start the app using Docker Compose
```bash
docker-compose up --build
```

### 🔹 4. Apply Database Migrations
```bash
cd backend
python manage.py migrate
```

### 🔹 5. Create a superuser
```bash
python manage.py createsuperuser
# Follow the superuser creation steps
```

### 🔹 6. Access the app!
App will be running at: <br>
📍 http://localhost:8000/admin (Django Admin) <br>
📍 http://localhost:3000 (Frontend) <br>
📍 http://localhost:8000 (Backend) 
