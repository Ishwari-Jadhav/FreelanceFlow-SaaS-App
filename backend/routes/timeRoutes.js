const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  startTimer,
  stopTimer,
  getTimeLogs
} = require("../controllers/timeController");

router.post("/start", authMiddleware, startTimer);
router.put("/stop/:id", authMiddleware, stopTimer);
router.get("/", authMiddleware, getTimeLogs);

module.exports = router;