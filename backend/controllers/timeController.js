const pool = require("../config/db");

// START TIMER
exports.startTimer = async (req, res) => {
  try {
    const { task_id } = req.body;

    const result = await pool.query(
      `INSERT INTO time_logs (task_id, user_id, start_time)
       VALUES ($1, $2, NOW()) RETURNING *`,
      [task_id, req.user.id]
    );

    await pool.query(
      "UPDATE tasks SET status = 'In Progress' WHERE id = $1",
      [task_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to start timer" });
  }
};

// STOP TIMER
exports.stopTimer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE time_logs 
       SET end_time = NOW(),
       duration = ROUND(EXTRACT(EPOCH FROM (NOW() - start_time))/60, 2)
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, req.user.id]
    );

    const log = result.rows[0];

    await pool.query(
      "UPDATE tasks SET status = 'Completed' WHERE id = $1",
      [log.task_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to stop timer" });
  }
};

// GET TIME LOGS
exports.getTimeLogs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM time_logs WHERE user_id = $1",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};