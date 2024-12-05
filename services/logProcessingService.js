const moment = require('moment');

// Standardize timestamps to ISO 8601 format
function standardizeTimestamp(timestamp) {
    return moment(timestamp).isValid() ? moment(timestamp).toISOString() : new Date().toISOString();  // Fall back to current date if invalid
  }

// Extract essential fields from logs (timestamp, log level, message, source)

function extractLogFields(log) {
    return {
      timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
      // timestamp: log.timestamp,  // Ensure timestamp is passed as Date object
      level: log.level || 'info',  // Use 'logLevel' to match the schema
      message: log.message,
      // source: log.source || 'unknown',  // Default to 'unknown' if source is missing
      source: log.source && log.source.trim() ? log.source.trim().toLowerCase() : 'unknown',
    };
  }
  

module.exports = { standardizeTimestamp, extractLogFields };

