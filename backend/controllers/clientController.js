const pool = require("../config/db");

// CREATE CLIENT
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, company, hourly_rate } = req.body;

    const result = await pool.query(
      `INSERT INTO clients (user_id, name, email, phone, company, hourly_rate)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, name, email, phone, company, hourly_rate]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create client" });
  }
};

// GET ALL CLIENTS
exports.getClients = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clients WHERE user_id = $1",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

// UPDATE CLIENT
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, hourly_rate } = req.body;

    const result = await pool.query(
      `UPDATE clients 
       SET name=$1, email=$2, phone=$3, company=$4, hourly_rate=$5
       WHERE id=$6 AND user_id=$7
       RETURNING *`,
      [name, email, phone, company, hourly_rate, id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update client" });
  }
};

// DELETE CLIENT
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM clients WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete client" });
  }
};