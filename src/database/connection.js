const { Pool } = require('pg');
const logger = require('../utils/logger');


// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // Render требует SSL, но с этой настройкой
  },
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Увеличили timeout
});


/**
 * Test database connection with retry logic
 */
async function testConnection() {


  const maxRetries = 3;
  

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    

    try {
      

      logger.info(`Database connection attempt ${attempt}/${maxRetries}`);
      

      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      

      logger.info('Database connected successfully', { 
        timestamp: result.rows[0].now,
        attempt 
      });
      

      client.release();
      return true;


    } catch (error) {
      

      logger.warn(`Database connection attempt ${attempt} failed`, { 
        error: error.message,
        code: error.code 
      });
      

      if (attempt === maxRetries) {
        logger.error('All database connection attempts failed', error);
        return false;
      }
      

      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));


    }
  }


}


/**
 * Execute query with error handling
 */
async function query(text, params = []) {


  const start = Date.now();
  

  try {
    

    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    

    logger.debug('Query executed', { 
      query: text.substring(0, 100), 
      duration: `${duration}ms`,
      rows: result.rowCount 
    });
    

    return result;


  } catch (error) {
    

    const duration = Date.now() - start;
    

    logger.error('Query failed', { 
      query: text.substring(0, 100),
      duration: `${duration}ms`,
      error: error.message 
    });
    

    throw error;


  }


}


/**
 * Get a client from the pool for transactions
 */
async function getClient() {
  

  const client = await pool.connect();
  

  const query = client.query;
  const release = client.release;


  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    logger.error('A client has been checked out for more than 5 seconds!');
  }, 5000);


  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };


  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };


  return client;


}


/**
 * Close all connections
 */
async function closeConnections() {


  try {
    

    await pool.end();
    logger.info('All database connections closed');


  } catch (error) {
    

    logger.error('Error closing database connections', error);


  }


}


// Handle process termination
process.on('SIGINT', closeConnections);
process.on('SIGTERM', closeConnections);


module.exports = {
  query,
  getClient,
  testConnection,
  closeConnections
};