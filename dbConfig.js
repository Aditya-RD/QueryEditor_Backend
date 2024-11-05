// dbConfig.js
const odbc = require('odbc');

// Define your ODBC connection string for SQL Server LocalDB
const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=(LocalDb)\\MSSQLLocalDB;Database=QueryEditor_DB;Trusted_Connection=yes;';

async function connectToDb() {
  let connection;
  try {
    // Connect to the database
    connection = await odbc.connect(connectionString);
    console.log('Connected to SQL Server via ODBC');
    return connection; // return the connection for use in other modules if needed
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// Export the connection function and the odbc package to allow query execution
module.exports = {
  connectToDb,
  odbc,
};