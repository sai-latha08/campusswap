# CampusSwap 🎓
> *"Learn. Share. Rent. Grow."*

CampusSwap is a production-quality, student-centric campus resource-sharing web application built on the MERN stack (MongoDB Atlas, Express.js, React.js, Node.js). It seamlessly unifies peer-to-peer skill exchange, physical item rentals, skill-for-item bartering, real-time messaging, and an automated trust & reputation engine.

---

## 🌟 Key Features

1. **Skill Exchange**: Rule-based student matching (compatibility, availability, ratings) with 1-on-1 session scheduling.
2. **Student Rentals**: Peer equipment sharing (calculators, lab tools, books, bicycles) with strict anti-overlap booking validation.
3. **Skill ↔ Item Barter (Signature Feature)**: Propose teaching sessions instead of paying cash for rental equipment.
4. **Real-time Chat**: Socket.io powered 1-on-1 messaging with read receipts and typing indicators.
5. **Trust & Reputation**: Automated 0-100 trust scoring based on verified college credentials and completed transactions.
6. **Notifications & Admin Dashboard**: Complete moderation, report dispute resolution, and platform health telemetry.

---

## 🏗️ Architecture & Tech Stack

```
CampusSwap/
├── client/              # React 19 + Vite + Tailwind CSS + Redux Toolkit
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route views
│   │   ├── layouts/     # MainLayout & Dashboard layouts
│   │   ├── services/    # Axios API client
│   │   └── store/       # Redux Toolkit slices
│   └── vite.config.js   # Vite server with /api proxy to port 5000
│
├── server/              # Node.js + Express + Mongoose + Socket.io
│   ├── config/          # MongoDB Atlas & Cloudinary configs
│   ├── controllers/     # Business logic handlers
│   ├── middleware/      # Auth, role authorization, validation, error handler
│   ├── models/          # 11 Mongoose data models
│   ├── routes/          # RESTful API routing
│   ├── utils/           # Async handler, custom AppError, response formatters
│   ├── app.js           # Express app setup with Helmet, CORS, Rate-limiting
│   └── server.js        # Server bootstrap & MongoDB Atlas connection
```

---

## 🚀 Quickstart

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account (connection URI)

### 1. Backend Setup
```bash
cd server
npm install
# Configure your server/.env with MONGODB_URI and JWT_SECRET
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and automatically proxies `/api` requests to `http://localhost:5000`.

---

## 📡 Health Check API
`GET http://localhost:5000/api/health`
```json
{
  "success": true,
  "message": "CampusSwap API is running",
  "data": {
    "environment": "development",
    "timestamp": "2026-09-23T15:00:00.000Z",
    "database": {
      "status": "connected",
      "name": "campusswap"
    },
    "version": "1.0.0"
  }
}
```
