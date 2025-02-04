const moment = require('moment');

// Standardize timestamps to ISO 8601 format
function standardizeTimestamp(timestamp) {
    return moment(timestamp).isValid() ? moment(timestamp).toISOString() : new Date().toISOString();  
  }


function extractLogFields(log) {
    return {
      timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
      level: log.level || 'info',  
      message: log.message,
      source: log.source && log.source.trim() ? log.source.trim().toLowerCase() : 'unknown',
    };
  }
  
module.exports = { standardizeTimestamp, extractLogFields };

