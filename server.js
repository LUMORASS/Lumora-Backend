const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB (if using a database)
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB Connected"))
        .catch(err => console.error("MongoDB Connection Error:", err));
}

// Authentication Middleware (if needed)
const authMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

// Root Route - Check if API is working
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Lumora Backend API!" });
});

// Public API Route
app.get("/api/public", (req, res) => {
    res.json({ success: true, message: "This is a public API route!" });
});

// Protected API Route (Requires API Key)
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({ success: true, message: "You have accessed a protected route!" });
});

// Catch-all Route for 404 Errors
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start Server (for local development)
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
