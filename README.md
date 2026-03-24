# 🔗 Cutbit

Cutbit is a **link tracking and analytics system** that transforms every redirect into a structured data event to generate insights about user behavior.

Instead of just shortening URLs, it captures metadata like **device, referrer, and location** on each request and aggregates it into **time-based analytics**.

> Built to explore how real-world tracking systems work — from request handling to data aggregation.

---

## 🚀 Live Demo

👉 [https://cutbit.vercel.app/](https://cutbit.vercel.app/)

---

## ⚡ What Makes It Different

- Treats each redirect as a **tracking event**, not just a URL lookup  
- Implements **unique visitor tracking** using cookie-based identification  
- Uses **daily aggregation** for efficient analytics queries  
- Applies **bot filtering heuristics** to improve data quality  
- Uses **in-memory caching (Map)** to reduce database reads  
- Designed with **scaling considerations** (distributed cache, async processing)

---

## 🧠 Core System Flow

When a user hits a short link:

1. Validate link (expiry, status)  
2. Check in-memory cache (Map) → fallback to database  
3. Filter bot traffic (user-agent + headers)  
4. Identify visitor via cookie (`visitorId`)  
5. Extract metadata:
   - Device (user-agent parsing)
   - Referrer (traffic source)
   - Location (GeoIP)
6. Store tracking event and update daily aggregates  
7. Redirect user  

> Each request is treated as a tracking event and processed into analytics data.

---

## 📊 Analytics Design

- **Request-based tracking** → every valid hit is logged  
- **Unique visitors** → cookie + daily deduplication  
- **Time-series aggregation** → optimized for charts (7D / 30D)  
- **Referrer normalization** → removes internal traffic noise  
- **Geo + device parsing** → enriches event data  

---

## ⚖️ Key Design Decisions

- **Synchronous tracking during redirect**
  - Simple and ensures consistency  
  - Adds latency at higher traffic  

- **In-memory caching (Map)**
  - Fast and reduces DB reads  
  - Not persistent or distributed  

- **Cookie-based visitor tracking**
  - Stateless and easy to implement  
  - Inaccurate across devices/browsers  

- **Daily aggregation**
  - Improves query performance  
  - Less flexible for custom ranges  

---

## 🏗️ Architecture
```
Client (React) → API (Express) → MongoDB
```

- Redirect route handles **validation + caching + tracking + response**  
- Event data stored separately for analytics  
- Aggregation reduces query load  
- React Query optimizes frontend data fetching  

---

## 📦 Scaling Considerations

The current system works well for moderate traffic. At higher scale, the following improvements would be required:

- Replace in-memory cache with **distributed cache (Redis)**  
- Move tracking to **asynchronous processing (queue-based)**  
- Pre-aggregate analytics data for faster queries  
- Use **CDN / edge-based redirects** for high traffic  

---

## 📸 Screenshots 
### Dashboard 
![Dashboard](./screenshot/dashboard.png) 
### My Links 
![My Links](./screenshot/mylinks.png) 
### Link Details 
![Link Details](./screenshot/linkdetail.png) 
### Link Analytics 
![Link Analytics](./screenshot/linkanalytics.png)

---

## ⚙️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- React Query  

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)  

**Tracking Tools**
- geoip-lite  
- ua-parser-js  

---

## 🔐 Authentication

- JWT-based authentication  
- Refresh token flow  
- Google OAuth  
- Protected routes and user isolation  

---

## ⚠️ Limitations

- Analytics are near real-time (not streaming)  
- Bot filtering is heuristic-based and not perfect  
- Unique visitors may be inflated across devices  
- Geo-location may be inaccurate for VPN/proxy users  
- **Cold start latency** due to free-tier deployment (Render)  
- In-memory cache is not persistent or distributed  
- Fixed timezone (IST) for aggregation  

---

## ⚡ Setup

```bash
git clone https://github.com/abhirawat03/Cutbit.git
cd cutbit
```

Frontend

```bash
cd client
npm install
npm run dev
```

Backend
```bash
cd server
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=8000
MONGODB_URL=

# Authentication
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

# OAuth (Google)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# External Services
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=   # Email service (e.g., verification, password reset)

# App URLs
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
client/   # React frontend
server/   # Express backend
```

---

## 🚀 Deployment 
* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 🧑‍💻 Author

Abhishek Rawat 

---

If you find this project useful, consider giving it a ⭐ on GitHub.
