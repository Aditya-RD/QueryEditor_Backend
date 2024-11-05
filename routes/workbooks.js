// routes/workbooks.js
const express = require('express');
const router = express.Router();

// Create a new workbook
router.post('/', async (req, res) => {
  const { name, description, profileId } = req.body;
  const db = req.app.locals.db;
  
  try {
    const query = `INSERT INTO Workbooks (Name, Description, ProfileID) VALUES (?, ?, ?)`;
    await db.query(query, [name, description, profileId]);
    res.status(201).send('Workbook created');
  } catch (err) {
    console.error('Error creating workbook:', err);
    res.status(500).send('Error creating workbook');
  }
});

// Read all workbooks
router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  
  try {
    const result = await db.query('SELECT * FROM Workbooks');
    res.json(result);
  } catch (err) {
    console.error('Error fetching workbooks:', err);
    res.status(500).send('Error fetching workbooks');
  }
});

// Update a workbook
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, profileid } = req.body;
  //const { profileid } = req.body;
  const db = req.app.locals.db;
  
  try {
    const query = `UPDATE Workbooks SET Name = ?, Description = ?, ProfileID = ? WHERE WorkbookID = ?`;
    await db.query(query, [name, description, profileid, id]);
    // const query = `UPDATE Workbooks SET ProfileID = ? WHERE WorkbookID = ?`;
    // await db.query(query, [profileid, id]);
    res.send('Workbook updated');
  } catch (err) {
    console.error('Error updating workbook:', err);
    res.status(500).send('Error updating workbook');
  }
});

// Delete a workbook
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;
  
  try {
    const query = `DELETE FROM Workbooks WHERE WorkbookID = ?`;
    await db.query(query, [id]);
    res.send('Workbook deleted');
  } catch (err) {
    console.error('Error deleting workbook:', err);
    res.status(500).send('Error deleting workbook');
  }
});

module.exports = router;
