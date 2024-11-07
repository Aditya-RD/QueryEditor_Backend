// routes/workbooks.js
const express = require('express');
const router = express.Router();

// Create a new workbook
router.post('/', async (req, res) => {
  const { name, description, profileId, moduleType } = req.body;
  const db = req.app.locals.db;

  try {
    // Use OUTPUT to get the new WorkbookID
    const queryWB = `INSERT INTO Workbooks (Name, Description, ProfileID, ModuleType) OUTPUT INSERTED.WorkbookID VALUES (?, ?, ?, ?)`;
    const resultWB = await db.query(queryWB, [name, description, profileId, moduleType]);
    
    // Extract the WorkbookID from the result
    const workbookId = resultWB[0].WorkbookID;

    const queryWS = `INSERT INTO Worksheets (WorkbookID, Name, EditorText, DesignConfig) OUTPUT INSERTED.WorksheetID VALUES (?, ?, ?, ?)`;
    const resultWS = await db.query(queryWS, [workbookId, "Worksheet 1", "", ""]);

    const worksheetId = resultWS[0].WorksheetID

    res.status(201).json({ message: 'Workbook created', workbookId, worksheetId });
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
  const { name, description, profileId, moduleType } = req.body;
  const db = req.app.locals.db;

  // Create an array for query parts and values based on provided fields
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push('Name = ?');
    values.push(name);
  }
  if (description !== undefined) {
    updates.push('Description = ?');
    values.push(description);
  }
  if (profileId !== undefined) {
    updates.push('ProfileID = ?');
    values.push(profileId);
  }
  if (moduleType !== undefined) {
    updates.push('ModuleType = ?');
    values.push(moduleType);
  }

  if (updates.length === 0) {
    return res.status(400).send('No valid fields to update');
  }

  // Build the final query dynamically
  const query = `UPDATE Workbooks SET ${updates.join(', ')} WHERE WorkbookID = ?`;
  values.push(id);

  try {
    await db.query(query, values);
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
