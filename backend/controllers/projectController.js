const pool = require("../config/db");

// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const { client_id, name, description, budget } = req.body;

    const result = await pool.query(
      `INSERT INTO projects (client_id, user_id, name, description, budget)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [client_id, req.user.id, name, description, budget]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

// GET PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects WHERE user_id = $1",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// UPDATE PROJECT
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, budget } = req.body;

    const result = await pool.query(
      `UPDATE projects 
       SET name=$1, description=$2, status=$3, budget=$4
       WHERE id=$5 AND user_id=$6
       RETURNING *`,
      [name, description, status, budget, id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
};

// DELETE PROJECT
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM projects WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};