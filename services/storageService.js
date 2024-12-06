
function cleanMessage(message) {
    if (typeof message !== 'string') {
      console.error('Invalid message format:', message);
      return ''; // Return empty string or set a default message
    }
    return message.replace(/[^a-zA-Z0-9\s]/g, ''); // Remove special characters
  }
  
  const Log = require('../models/logModel');
  
  async function saveLog(log) {
    try {
      // Ensure the message is cleaned and not empty
      if (!log.message || log.message.trim() === '') {
        log.message = 'No message provided'; // Or skip saving this log entry
        console.warn('Log entry with missing or empty message:', log);
      } else {
        log.message = cleanMessage(log.message);
      }

      if (!log.timestamp || !log.level) {
        console.warn('Missing essential log fields (timestamp/level)', log);
        return; // Skip saving the log if essential fields are missing
      }
  
      console.log('Log data before saving:', log); // Log the data being saved
      const newLog = new Log(log); // Create a new log document
      await newLog.save(); // Save the log to the database
      console.log('Log saved');
    } catch (err) {
      console.error('Error saving log:', err); // Handle any errors
    }
  }
  
  module.exports = { saveLog };