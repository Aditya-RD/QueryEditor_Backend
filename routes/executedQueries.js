// routes/executedQueries.js
const express = require('express');
const router = express.Router();

// Create a new executed query
router.post('/', async (req, res) => {
  const { worksheetId, queryText, executionResult } = req.body;
  const db = req.app.locals.db;

  try {
    const query = `INSERT INTO ExecutedQueries (WorksheetID, QueryText, ExecutionResult) VALUES (?, ?, ?)`;
    await db.query(query, [worksheetId, queryText, executionResult]);
    res.status(201).send('Executed query created');
  } catch (err) {
    console.error('Error creating executed query:', err);
    res.status(500).send('Error creating executed query');
  }
});

// Read all executed queries for a specific worksheet
router.get('/:worksheetId', async (req, res) => {
  const { worksheetId } = req.params;
  const db = req.app.locals.db;

  try {
    const query = `SELECT ExecutedQueryId, WorksheetID, QueryText, ExecutionResult FROM ExecutedQueries WHERE WorksheetID = ?`;
    const result = await db.query(query, [worksheetId]);
    res.json(result);
  } catch (err) {
    console.error('Error fetching executed queries:', err);
    res.status(500).send('Error fetching executed queries');
  }
});

// Update an executed query
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { queryText, executionResult } = req.body;
  const db = req.app.locals.db;

  try {
    const query = `UPDATE ExecutedQueries SET QueryText = ?, ExecutionResult = ? WHERE ExecutedQueryID = ?`;
    await db.query(query, [queryText, executionResult, id]);
    res.send('Executed query updated');
  } catch (err) {
    console.error('Error updating executed query:', err);
    res.status(500).send('Error updating executed query');
  }
});

// Delete an executed query
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;

  try {
    const query = `DELETE FROM ExecutedQueries WHERE ExecutedQueryID = ?`;
    await db.query(query, [id]);
    res.send('Executed query deleted');
  } catch (err) {
    console.error('Error deleting executed query:', err);
    res.status(500).send('Error deleting executed query');
  }
});

module.exports = router;
