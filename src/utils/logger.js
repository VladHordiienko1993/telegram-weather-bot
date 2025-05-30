/**
 * Simple production-ready logger
 */
class Logger {

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }


  /**
   * Format log message with timestamp and level
   */
  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }


  /**
   * Info level logging
   */
  info(message, meta = null) {
    console.log(this.formatMessage('INFO', message));
    if (meta && this.isDevelopment) {
      console.log('Meta:', meta);
    }
  }


  /**
   * Error level logging
   */
  error(message, error = null) {
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      if (this.isDevelopment) {
        console.error('Error details:', error);
      } else {
        // In production, log only error message to avoid sensitive data
        console.error('Error message:', error.message || error);
      }
    }
  }


  /**
   * Warning level logging
   */
  warn(message, meta = null) {
    console.warn(this.formatMessage('WARN', message));
    if (meta && this.isDevelopment) {
      console.warn('Meta:', meta);
    }
  }

  /**
   * Debug level logging (only in development)
   */
  debug(message, meta = null) {
    if (this.isDevelopment) {
      console.log(this.formatMessage('DEBUG', message));
      if (meta) {
        console.log('Debug meta:', meta);
      }
    }
  }


}
module.exports = new Logger();