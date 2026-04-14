# QuickFix — Full-Stack Mechanic Booking Platform

A high-performance, real-time platform for booking mechanics, tracking repairs, and managing vehicle service requests.

## 🚀 Teck Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Axios, React Query
- **Backend**: Node.js, Express, MongoDB (Mongoose), Redis, Socket.io
- **Real-time**: Bidirectional communication for live tracking and chat
- **Security**: JWT Auth, Helmet, Rate Limiting, Mongo Sanitize

---

## 🛠️ Project Structure

```bash
├── backend        # Express API, Socket.io, Mongoose Models
└── frontend       # Vite + React Dashboard & Landing Page
```

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas)
- Redis (Optional, falls back to memory if unavailable)

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env based on .env.example
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Configure .env based on .env.example
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## ✨ Key Features

- **Live Tracking**: See your mechanic's location in real-time on a map.
- **Role-Based Portals**: Dedicated dashboards for Drivers, Mechanics, and Admins.
- **Instant Chat**: Integrated messaging between customers and service providers.
- **Emergency Dispatch**: One-click requests for urgent roadside assistance.
- **Approval Workflow**: Admins review and verify mechanic profiles before they go live.
