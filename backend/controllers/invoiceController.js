const pool = require("../config/db");
const PDFDocument = require("pdfkit");

// ======================
// CREATE INVOICE
// ======================
exports.createInvoice = async (req, res) => {
  try {
    const { client_id, start_date, end_date } = req.body;

    // 1. Get all UNBILLED logs for selected client
    const logs = await pool.query(
    `SELECT tl.*, c.hourly_rate
    FROM time_logs tl
    JOIN tasks t ON tl.task_id = t.id
    JOIN projects p ON t.project_id = p.id
    JOIN clients c ON p.client_id = c.id
    WHERE tl.user_id = $1
    AND c.id = $2
    AND tl.is_billed = false`,
    [req.user.id, client_id]
  );

    // 2. Calculate total
    let total = 0;

    logs.rows.forEach((log) => {
      const duration = parseFloat(log.duration) || 0;
      const rate = parseFloat(log.hourly_rate) || 0;

      total += duration * rate;
    });

    total = Number(total.toFixed(2));

    // 3. Create invoice
    const invoice = await pool.query(
      `INSERT INTO invoices 
       (user_id, client_id, total_amount, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, client_id, total, start_date, end_date]
    );

    // 4. Mark ONLY used logs as billed
    const logIds = logs.rows.map((log) => log.id);

    if (logIds.length > 0) {
      await pool.query(
        `UPDATE time_logs
         SET is_billed = true
         WHERE id = ANY($1::int[])`,
        [logIds]
      );
    }

    // 5. Response
    res.json({
      invoice: invoice.rows[0],
      total,
      logs: logs.rows.length,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Invoice creation failed" });
  }
};

// ======================
// GENERATE PDF
// ======================

exports.generatePDF = async (req, res) => {
  try {
    const { id } = req.params;

    // Get invoice + client details
    const result = await pool.query(
      `SELECT i.*, c.name, c.company, c.hourly_rate
       FROM invoices i
       JOIN clients c ON i.client_id = c.id
       WHERE i.id = $1 AND i.user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const data = result.rows[0];

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${id}.pdf`
    );

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("FreelanceFlow Invoice", { align: "center" });
    doc.moveDown();

    // Invoice details
    doc.fontSize(12).text(`Invoice ID: ${data.id}`);
    doc.text(`Client: ${data.name}`);
    doc.text(`Company: ${data.company}`);
    doc.text(`Hourly Rate: Rs. ${data.hourly_rate}/hr`);
    doc.text(`Total Amount: Rs. ${data.total_amount}`);
    doc.text(`Date: ${new Date(data.created_at).toDateString()}`);

    doc.moveDown();
    doc.text("Thank you for your business!", { align: "center" });

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PDF generation failed" });
  }
};

// GET ALL INVOICES
exports.getInvoices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.name AS client_name
       FROM invoices i
       JOIN clients c ON i.client_id = c.id
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};