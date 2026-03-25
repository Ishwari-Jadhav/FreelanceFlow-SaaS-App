const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createClient,
  getClients,
  updateClient,
  deleteClient
} = require("../controllers/clientController");

router.post("/", authMiddleware, createClient);
router.get("/", authMiddleware, getClients);
router.put("/:id", authMiddleware, updateClient);
router.delete("/:id", authMiddleware, deleteClient);

module.exports = router;