// routes/worksheets.js
const express = require('express');
const router = express.Router();

// Create a new worksheet
router.post('/', async (req, res) => {
  const { workbookId, name, editorText, designConfig } = req.body;
  const db = req.app.locals.db;

  try {
    const query = `INSERT INTO Worksheets (WorkbookID, Name, EditorText, DesignConfig) VALUES (?, ?, ?, ?)`;
    await db.query(query, [workbookId, name, editorText, designConfig]);
    res.status(201).send('Worksheet created');
  } catch (err) {
    console.error('Error creating worksheet:', err);
    res.status(500).send('Error creating worksheet');
  }
});

// Read details for a specific workbook and its worksheets
router.get('/:workbookId', async (req, res) => {
  const workbookId = parseInt(req.params.workbookId, 10);
  const db = req.app.locals.db;

  try {
    // Query to fetch workbook details
    const workbookQuery = `SELECT WorkbookID, Name, Description, ProfileID, Timestamp FROM Workbooks WHERE WorkbookID = ?`;
    const workbookResult = await db.query(workbookQuery, [workbookId]);

    // Check if the workbook exists
    if (workbookResult.length === 0) {
      return res.status(404).json({ message: 'Workbook not found' });
    }

    // Query to fetch worksheets for the workbook
    const worksheetsQuery = `SELECT WorksheetID, WorkbookID, Name, EditorText, DesignConfig FROM Worksheets WHERE WorkbookID = ?`;
    const worksheetsResult = await db.query(worksheetsQuery, [workbookId]);

    // Construct response with both workbook details and worksheets
    const response = {
      workbook: workbookResult[0],      // Workbook details
      worksheets: worksheetsResult      // Associated worksheets
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching workbook and worksheets:', err);
    res.status(500).send('Error fetching workbook and worksheets');
  }
});


// Update a worksheet
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, editorText, designConfig } = req.body;
  const db = req.app.locals.db;

  try {
    const query = `UPDATE Worksheets SET Name = ?, EditorText = ?, DesignConfig = ? WHERE WorksheetID = ?`;
    await db.query(query, [name, editorText, designConfig, id]);
    res.send('Worksheet updated');
  } catch (err) {
    console.error('Error updating worksheet:', err);
    res.status(500).send('Error updating worksheet');
  }
});

// Delete a worksheet
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;

  try {
    const query = `DELETE FROM Worksheets WHERE WorksheetID = ?`;
    await db.query(query, [id]);
    res.send('Worksheet deleted');
  } catch (err) {
    console.error('Error deleting worksheet:', err);
    res.status(500).send('Error deleting worksheet');
  }
});

module.exports = router;
