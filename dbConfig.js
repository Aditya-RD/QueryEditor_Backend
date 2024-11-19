const odbc = require('odbc');

// Define your ODBC connection string for SQL Server LocalDB
const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=(LocalDb)\\MSSQLLocalDB;Database=QueryEditor_DB;Trusted_Connection=yes;';

let pool; // Define a pool variable for reuse

async function connectToDb() {
  try {
    if (!pool) {
      // Create a connection pool if it doesn't already exist
      pool = await odbc.pool(connectionString);
      console.log('Connection pool created and connected to SQL Server via ODBC');
    }
    return pool;
  } catch (error) {
    console.error('Failed to create connection pool:', error);
    throw error;
  }
}

// Function to close the pool and reset connections
async function resetDbConnection() {
  if (pool) {
    try {
      await pool.close(); // Close the existing pool
      pool = null; // Reset the pool
      console.log('Connection pool closed.');
    } catch (error) {
      console.error('Failed to close connection pool:', error);
    }
  }
}

// Export the functions
module.exports = {
  connectToDb,
  resetDbConnection,
  odbc,
};
