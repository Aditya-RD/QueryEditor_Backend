// routes/savedQueries.js
const express = require('express');
const router = express.Router();

// Create a new saved query
router.post('/', async (req, res) => {
  const { worksheetId, queryText } = req.body;
  const db = req.app.locals.db;

  try {
    const query = `INSERT INTO SavedQueries (WorksheetID, QueryText) VALUES (?, ?)`;
    await db.query(query, [worksheetId, queryText]);
    res.status(201).send('Saved query created');
  } catch (err) {
    console.error('Error creating saved query:', err);
    res.status(500).send('Error creating saved query');
  }
});

// Read all saved queries for a specific worksheet
router.get('/:worksheetId', async (req, res) => {
  const { worksheetId } = req.params;
  const db = req.app.locals.db;

  try {
    const query = `SELECT SavedQueryId, WorksheetID, QueryText FROM SavedQueries WHERE WorksheetID = ?`;
    const result = await db.query(query, [worksheetId]);
    res.json(result);
  } catch (err) {
    console.error('Error fetching saved queries:', err);
    res.status(500).send('Error fetching saved queries');
  }
});

// Update a saved query
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { queryText } = req.body;
  const db = req.app.locals.db;

  try {
    const query = `UPDATE SavedQueries SET QueryText = ? WHERE SavedQueryID = ?`;
    await db.query(query, [queryText, id]);
    res.send('Saved query updated');
  } catch (err) {
    console.error('Error updating saved query:', err);
    res.status(500).send('Error updating saved query');
  }
});

// Delete a saved query
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;

  try {
    const query = `DELETE FROM SavedQueries WHERE SavedQueryID = ?`;
    await db.query(query, [id]);
    res.send('Saved query deleted');
  } catch (err) {
    console.error('Error deleting saved query:', err);
    res.status(500).send('Error deleting saved query');
  }
});

module.exports = router;
