const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { createInvoice, generatePDF, getInvoices } = require("../controllers/invoiceController");

router.get("/", authMiddleware, getInvoices);

// Create invoice
router.post("/", authMiddleware, createInvoice);

// Generate PDF
router.get("/pdf/:id", authMiddleware, generatePDF);

module.exports = router;