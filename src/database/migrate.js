require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./connection');
const logger = require('../utils/logger');


async function runMigrations() {


  try {
    

    logger.info('Starting database migrations...');
    

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_create_users_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    

    // Execute migration
    await db.query(migrationSQL);
    

    logger.info('Migration completed successfully');
    

    // Test with sample user
    const User = require('./models/User'); // Исправленный путь
    const testUser = await User.createOrUpdate({
      userId: 123456789,
      username: 'test_user',
      firstName: 'Test',
      lastName: 'User',
      language: 'en'
    });
    

    logger.info('Test user created', { user: testUser });
    

    process.exit(0);


  } catch (error) {
    

    logger.error('Migration failed', error);
    process.exit(1);


  }


}


if (require.main === module) {
  runMigrations();
}


module.exports = { runMigrations };