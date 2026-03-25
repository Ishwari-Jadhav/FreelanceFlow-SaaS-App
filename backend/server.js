const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FreelanceFlow API is running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

const clientRoutes = require("./routes/clientRoutes");

app.use("/api/clients", clientRoutes);

const projectRoutes = require("./routes/projectRoutes");

app.use("/api/projects", projectRoutes);

const taskRoutes = require("./routes/taskRoutes");

app.use("/api/tasks", taskRoutes);

const timeRoutes = require("./routes/timeRoutes");

app.use("/api/time", timeRoutes);

const invoiceRoutes = require("./routes/invoiceRoutes");

app.use("/api/invoices", invoiceRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/dashboard", dashboardRoutes);