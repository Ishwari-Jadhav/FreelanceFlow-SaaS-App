const pool = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT p.id) AS projects,
        COUNT(DISTINCT t.id) AS tasks,
        COALESCE(SUM(i.total_amount), 0) AS earnings
       FROM projects p
       LEFT JOIN tasks t ON p.id = t.project_id
       LEFT JOIN invoices i ON p.client_id = i.client_id
       WHERE p.user_id = $1`,
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};