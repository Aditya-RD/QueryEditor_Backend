// routes/worksheets.js
const express = require('express');
const router = express.Router();

// Create a new worksheet
router.post('/', async (req, res) => {
  const { workbookId, name, editorText, designConfig } = req.body;
  const db = req.app.locals.db;

  try {
    const query = `INSERT INTO Worksheets (WorkbookID, Name, EditorText, DesignConfig) OUTPUT INSERTED.WorksheetID VALUES (?, ?, ?, ?)`;
    const result = await db.query(query, [workbookId, name, editorText, designConfig]);
    const worksheetId = result[0].WorksheetID
    res.status(201).send({message: 'Worksheet created', worksheetId});
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

  // Create query parts based on provided fields
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push('Name = ?');
    values.push(name);
  }
  if (editorText !== undefined) {
    updates.push('EditorText = ?');
    values.push(editorText);
  }
  if (designConfig !== undefined) {
    updates.push('DesignConfig = ?');
    values.push(designConfig);
  }

  if (updates.length === 0) {
    return res.status(400).send('No valid fields to update');
  }

  const query = `UPDATE Worksheets SET ${updates.join(', ')} WHERE WorksheetID = ?`;
  values.push(id);

  try {
    await db.query(query, values);
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
