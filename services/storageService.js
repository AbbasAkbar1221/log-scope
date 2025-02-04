
function cleanMessage(message) {
    if (typeof message !== 'string') {
      console.error('Invalid message format:', message);
      return ''; // Return empty string
    }
    return message.replace(/[^a-zA-Z0-9\s]/g, ''); // Remove special characters
  }
  
  const Log = require('../models/logModel');
  
  async function saveLog(log) {
    try {
      // Ensure the message is cleaned and not empty
      if (!log.message || log.message.trim() === '') {
        log.message = 'No message provided'; 
        console.warn('Log entry with missing or empty message:', log);
      } else {
        log.message = cleanMessage(log.message);
      }

      if (!log.timestamp || !log.level) {
        console.warn('Missing essential log fields (timestamp/level)', log);
        return; 
      }
  
      console.log('Log data before saving:', log); 
      const newLog = new Log(log); 
      await newLog.save(); 
      console.log('Log saved');
    } catch (err) {
      console.error('Error saving log:', err);
    }
  }
  
  module.exports = { saveLog };