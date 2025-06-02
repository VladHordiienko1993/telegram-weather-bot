const db = require('../connection');
const logger = require('../../utils/logger');


class User {


  /**
   * Find user by Telegram ID
   */
  static async findByTelegramId(userId) {


    try {
      

      const result = await db.query(
        'SELECT * FROM users WHERE user_id = $1',
        [userId]
      );
      

      return result.rows[0] || null;


    } catch (error) {
      

      logger.error('Error finding user by Telegram ID', { userId, error: error.message });
      throw error;


    }


  }


  /**
   * Create or update user
   */
  static async createOrUpdate(userData) {


    const { userId, username, firstName, lastName, language = 'en' } = userData;


    try {
      

      const result = await db.query(`
        INSERT INTO users (user_id, username, first_name, last_name, language)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          username = EXCLUDED.username,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          updated_at = NOW()
        RETURNING *
      `, [userId, username, firstName, lastName, language]);
      

      logger.debug('User created or updated', { 
        userId, 
        username,
        action: result.rowCount > 0 ? 'upserted' : 'created'
      });
      

      return result.rows[0];


    } catch (error) {
      

      logger.error('Error creating/updating user', { userId, error: error.message });
      throw error;


    }


  }


  /**
   * Update user language
   */
  static async updateLanguage(userId, language) {


    try {
      

      const result = await db.query(
        'UPDATE users SET language = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *',
        [language, userId]
      );
      

      if (result.rowCount === 0) {
        throw new Error('User not found');
      }
      

      logger.info('User language updated', { userId, language });
      

      return result.rows[0];


    } catch (error) {
      

      logger.error('Error updating user language', { userId, language, error: error.message });
      throw error;


    }


  }


  /**
   * Get user language (with fallback to default)
   */
  static async getLanguage(userId) {


    try {
      

      const result = await db.query(
        'SELECT language FROM users WHERE user_id = $1',
        [userId]
      );
      

      return result.rows[0]?.language || 'en'; // Default to English


    } catch (error) {
      

      logger.error('Error getting user language', { userId, error: error.message });
      return 'en'; // Fallback to English on error


    }


  }


  /**
   * Get users count by language
   */
  static async getLanguageStats() {


    try {
      

      const result = await db.query(`
        SELECT language, COUNT(*) as user_count 
        FROM users 
        GROUP BY language 
        ORDER BY user_count DESC
      `);
      

      return result.rows;


    } catch (error) {
      

      logger.error('Error getting language stats', { error: error.message });
      return [];


    }


  }


  /**
   * Get total users count
   */
  static async getTotalCount() {


    try {
      

      const result = await db.query('SELECT COUNT(*) as total FROM users');
      

      return parseInt(result.rows[0].total);


    } catch (error) {
      

      logger.error('Error getting total users count', { error: error.message });
      return 0;


    }


  }


}
module.exports = User;