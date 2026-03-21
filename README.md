# 🔗 Cutbit

A full-stack URL shortener built with the MERN stack, designed for developers and marketers who want more than just short links — real analytics, performance insights, and clean architecture.

Cutbit focuses on **near real-time analytics**, **scalable data tracking**, and **performance-optimized frontend fetching using React Query**.

---

## 🚀 Live Demo

👉 [https://cutbit.vercel.app/](https://cutbit.vercel.app/)

---

## ⚙️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router
* React Query

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Other Tools

* geoip-lite (geolocation tracking)
* ua-parser-js (device & browser detection)
* Google OAuth (authentication)

---

## ✨ Features

### 🔗 Core Functionality

* Create short URLs from long links
* Custom aliases for links
* Share links or QR codes instantly

### 🔍 Link Analytics

* Track total clicks and unique visitors for each link
* View performance over time (7 days / 30 days)
* See which devices users are coming from (mobile, desktop, tablet)
* Identify traffic sources (referrer tracking)
* Understand audience location (country-level data)
* Get a complete breakdown of each link’s performance (device, referrer, geography, clicks and unique visitors charts)

### 📈 Dashboard

* Centralized dashboard for all links
* Growth trends visualization

### 🔐 Authentication

* JWT-based authentication
* Email & password login
* Google OAuth login
* Protected routes
* User-specific data isolation
* Secure password hashing

---

## 🧠 How It Works

1. User submits a long URL (and optional metadata)
2. Backend generates a unique short ID
3. Short link is stored in MongoDB
4. User shares the link or QR code
5. When someone clicks:

   * Request hits backend
   * Analytics data is captured (IP → geo, user agent → device)
   * Click event is stored instantly
   * User is redirected to the original URL
6. Dashboard fetches and displays analytics using React Query (optimized caching & refetching)

---

## ⚡ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/abhirawat03/Cutbit.git
cd cutbit
```

### 2. Install Dependencies

#### Frontend

```bash
cd client
npm install
npm run dev
```

#### Backend

```bash
cd server
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=8000
DB_NAME=
MONGODB_URL=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FRONTEND_URL=
BACKEND_URL=
```

### Frontend (.env)

```env
VITE_BACKEND_URL=
```

---

## 📁 Project Structure

```
client/
  src/
    components/
    pages/
    hooks/
    services/
    context/
    providers/
    lib/
    assets/
    api/
    App.jsx
    main.jsx

server/
  src/
    controllers/
    routes/
    models/
    middleware/
    config/
    db/
    utils/
    app.js
    index.js
```

---

## 🚀 Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## ⚠️ Notes / Limitations

* Analytics are near real-time but not streaming (depends on request frequency)
* Free-tier backend (Render) may experience cold starts

---

## 🧑‍💻 Author

Abhishek Rawat

---

If you find this project useful, consider giving it a ⭐ on GitHub.
