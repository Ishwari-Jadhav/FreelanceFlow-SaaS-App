const pool = require("../config/db");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { project_id, title, description, due_date } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks (project_id, user_id, title, description, due_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_id, req.user.id, title, description, due_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// GET TASKS
exports.getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body;

    const result = await pool.query(
      `UPDATE tasks 
       SET title=$1, description=$2, status=$3, due_date=$4
       WHERE id=$5 AND user_id=$6
       RETURNING *`,
      [title, description, status, due_date, id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM tasks WHERE id=$1 AND user_id=$2",
      [id, req.user.id]
    );

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};