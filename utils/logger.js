const logger = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  },
  error: (message, error) => {
    if (error) {
      if (typeof error === 'object' && Object.keys(error).length > 0) {
        // Format error object for better readability
        const errorStr = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}\n${errorStr}`);
      } else {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error);
      }
    } else {
      console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
    }
  },
  warn: (message, data) => {
    if (data) {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data);
    } else {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
    }
  },
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      if (data) {
        console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`, data);
      } else {
        console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
      }
    }
  }
};

module.exports = logger;