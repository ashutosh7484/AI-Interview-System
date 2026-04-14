// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Connect to MongoDB


const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true
}));

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/results',   resultRoutes);

// ─── Health Check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '✅ AI Interview API is running' });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message 
  });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
