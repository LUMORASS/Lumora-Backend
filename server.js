// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 Lumora Backend is running!");
});

// ✅ Sample Public API Endpoint
app.get("/api/public", (req, res) => {
  res.json({ message: "✅ Public API is working!" });
});

// ✅ Sample Private API Endpoint (Protected)
app.get("/api/private", (req, res) => {
  if (!process.env.SECRET_KEY) {
    return res.status(401).json({ error: "❌ Unauthorized: SECRET_KEY not set!" });
  }
  res.json({ message: "🔒 Private API is accessible!", key: process.env.SECRET_KEY });
});

// ✅ Start Server (For Local Development Only)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Server running locally at http://localhost:${PORT}`);
  });
}

// ✅ Export app for Vercel Deployment
module.exports = app;
