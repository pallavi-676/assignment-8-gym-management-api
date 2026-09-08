require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

const connectDB = require("./config/db");
require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

connectDB();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "development_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({
    message: "Gym & Fitness Club Management API is running",
    endpoints: {
      auth: "/api/auth",
      classes: "/api/classes",
      members: "/api/members"
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/members", memberRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
