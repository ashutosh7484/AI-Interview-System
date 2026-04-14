# 🤖 InterviewAI — AI-Powered Interview System

<div align="center">

![InterviewAI Banner](https://img.shields.io/badge/InterviewAI-AI%20Powered-6366f1?style=for-the-badge&logo=openai&logoColor=white)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Pro-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

**A full-stack AI-powered mock interview platform that generates role-specific questions, evaluates your answers in real-time, and gives detailed performance feedback — just like a real technical interviewer.**

[🚀 Live Demo](#) • [📸 Screenshots](#screenshots) • [⚡ Quick Start](#quick-start) • [📖 Docs](#installation)

</div>

---

## ✨ Why This Project Stands Out

> Most interview prep tools show you **static question banks**. InterviewAI is different.

| Feature | Static Tools | InterviewAI |
|---|---|---|
| Question variety | ❌ Same questions forever | ✅ AI generates unique questions every time |
| Answer evaluation | ❌ You self-assess | ✅ AI reads & scores your actual answers |
| Personalized feedback | ❌ Generic tips | ✅ Specific feedback per answer |
| Role-specific | ❌ Generic | ✅ Tailored to exact job role |
| Difficulty scaling | ❌ Fixed | ✅ Easy / Medium / Hard |
| Score tracking | ❌ Manual | ✅ Full history with analytics |

**This is not a quiz app.** It's a complete AI interview simulator that:
- 🧠 **Thinks like a real interviewer** — questions adapt to role and difficulty
- 📝 **Reads your answers** — AI evaluates actual text, not multiple choice
- 🎯 **Identifies your weak spots** — strengths and improvement areas
- 📊 **Tracks your growth** — score history across all interviews

---

## 🎬 Live Demo

> 🔗 **[Try it live →](#)** (https://ai-interview-system-coral.vercel.app)

---

## 📸 Screenshots

### Login Page
> Clean dark UI with JWT authentication

### Dashboard
> Stats overview, interview history, and one-click interview start

### Interview Page
> Real-time timer, question navigation dots, progress bar

### Results Page
> Animated score ring, AI feedback, strengths & improvements breakdown

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│   Login │ Signup │ Dashboard │ Interview │ Results      │
└───────────────────────┬─────────────────────────────────┘
                        │ REST API (Axios + JWT)
┌───────────────────────▼─────────────────────────────────┐
│                 BACKEND (Node + Express)                 │
│   /api/auth │ /api/interview │ /api/results              │
│   JWT Middleware │ CORS │ Error Handler                  │
└────────────────┬──────────────────────┬─────────────────┘
                 │                      │
    ┌────────────▼──────┐    ┌──────────▼──────────────┐
    │   MongoDB Atlas   │    │     Google Gemini API    │
    │  users collection │    │  Generate Questions      │
    │  interviews       │    │  Evaluate Answers        │
    │  results          │    │  Score + Feedback        │
    └───────────────────┘    └─────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with hooks |
| **Tailwind CSS** | Utility-first styling |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Context API** | Global auth state management |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **Mongoose** | MongoDB object modeling |
| **JWT** | Stateless authentication |
| **bcryptjs** | Password hashing |

### Services
| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud database |
| **Google Gemini 2.5 Pro** | AI question generation & evaluation |

---

## 🔄 How It Works

```
1. 👤 Candidate signs up / logs in
         ↓ JWT token issued

2. 🎯 Selects job role + difficulty
         ↓ POST /api/interview/start

3. 🤖 Gemini AI generates unique questions
         ↓ Stored in MongoDB

4. ✍️  Candidate answers each question
         ↓ Timer runs, progress tracked

5. 📤 Answers submitted
         ↓ POST /api/interview/submit

6. 🧠 AI evaluates every answer
         ↓ Scores 0-10 per question + feedback

7. 📊 Results displayed
         ↓ Score, strengths, improvements saved

8. 📈 Dashboard shows full history
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Google Gemini API key (free)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/ai-interview-system.git
cd ai-interview-system
```

**2. Install backend dependencies**
```bash
cd backend
npm install
```

**3. Install frontend dependencies**
```bash
cd ../frontend
npm install
```

**4. Configure environment variables**

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

**5. Run the application**

Terminal 1 — Backend:
```bash
cd backend
npm run dev
```

Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

**6. Open your browser**
```
http://localhost:5173
```

---

## 🔑 Get Your API Keys

| Service | Link | Cost |
|---|---|---|
| MongoDB Atlas | [cloud.mongodb.com](https://cloud.mongodb.com) | Free M0 tier |
| Gemini API Key | [aistudio.google.com/apikey](https://aistudio.google.com/app/apikey) | Free tier |

---

## 📁 Project Structure

```
ai-interview-system/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Login/Signup logic
│   │   ├── interviewController.js # Interview management
│   │   └── resultController.js    # Results & history
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Interview.js           # Interview schema
│   │   └── Result.js              # Result schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── resultRoutes.js
│   ├── services/
│   │   └── geminiService.js       # All AI logic
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/axios.js           # HTTP client config
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx    # Global auth state
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            ├── Dashboard.jsx
            ├── Interview.jsx
            └── Results.jsx
```

---

## 🔌 API Reference

### Auth Routes
```
POST   /api/auth/signup     Register new user
POST   /api/auth/login      Login, receive JWT
GET    /api/auth/me         Get logged-in user
```

### Interview Routes
```
POST   /api/interview/start      Start interview (AI generates questions)
POST   /api/interview/submit     Submit answers (AI evaluates)
GET    /api/interview/history    Get completed interviews
GET    /api/interview/:id        Get single interview
```

### Result Routes
```
GET    /api/results              Get all results
GET    /api/results/stats/summary  Dashboard stats
GET    /api/results/:id          Get single result
```

---

## 🔐 Security Features

- ✅ Passwords hashed with **bcrypt** (salt rounds: 10)
- ✅ **JWT authentication** on all protected routes
- ✅ Token expiry (7 days)
- ✅ Ownership verification on every data request
- ✅ CORS configured for specific origin
- ✅ Environment variables for all secrets

---

## 🗺️ Roadmap

- [ ] Voice input for answers
- [ ] Resume upload → AI-tailored questions
- [ ] Google OAuth login
- [ ] PDF result download
- [ ] Score progress charts
- [ ] Follow-up questions based on weak answers
- [ ] Admin dashboard
- [ ] Email results to candidate

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Ashutosh Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/ashutosh7484)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ashutosh-kumar-083860291/)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Built with ❤️ using React, Node.js, and Google Gemini AI

</div>
