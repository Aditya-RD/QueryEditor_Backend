// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDb } = require('./dbConfig');

// Import routes
const workbooksRoutes = require('./routes/workbooks');
const worksheetsRoutes = require('./routes/worksheets');
const savedQueriesRoutes = require('./routes/savedQueries');
const executedQueriesRoutes = require('./routes/executedQueries');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
// Configure CORS to allow all origins
app.use(cors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include all necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify headers that are expected in requests
  }));
  
  // Handle preflight requests for all routes
  app.options('*', cors()); // Allows all routes to respond to preflight requests

// Connect to the database and store the connection in app.locals
connectToDb().then((connection) => {
  app.locals.db = connection;
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1); // Exit if the database connection fails
});

// Use routes
app.use('/workbooks', workbooksRoutes);
app.use('/worksheets', worksheetsRoutes);
app.use('/saved-queries', savedQueriesRoutes);
app.use('/executed-queries', executedQueriesRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
