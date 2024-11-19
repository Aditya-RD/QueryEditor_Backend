// routes/savedQueries.js
const express = require('express');
const router = express.Router();
const { resetDbConnection } = require('../dbConfig');

// Create a new saved query
router.post('/reset-connection', async (req, res) => {
  try {
    await resetDbConnection();
    res.send('Database connection pool has been reset.');
  } catch (error) {
    res.status(500).send('Failed to reset database connection pool.');
  }
});

module.exports = router;
