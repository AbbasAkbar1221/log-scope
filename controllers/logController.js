const csvParser = require('csv-parser');
const { standardizeTimestamp, extractLogFields } = require('../services/logProcessingService');
const { saveLog } = require('../services/storageService');
const streamifier = require('streamifier');

async function processJsonLog(fileBuffer) {
    try {
      // Parse the entire file as JSON
      const logs = JSON.parse(fileBuffer.toString('utf-8'));
  
      // Validate that the parsed data is an array
      if (!Array.isArray(logs)) {
        console.error('Expected a JSON array of logs, but got:', logs);
        return;
      }
  
      console.log('Number of logs to process:', logs.length);
  
      // Iterate over each log entry and save
      for (const log of logs) {
        // Validate the structure of each log
        if (!log.timestamp || !log.level || !log.message) {
          console.error('Skipping invalid log:', log);
          continue;
        }

        log.source = log.source && log.source.trim() ? log.source.trim().toLowerCase() : 'unknown';
  
        // Standardize the timestamp if needed
        log.timestamp = standardizeTimestamp(log.timestamp);
       
        // Save the log
        await saveLog(log);
        console.log('Log saved:', log);
      }
    } catch (error) {
      console.error('Error processing JSON logs:', error.message);
    }
  }
  
  
// Process CSV logs from buffer

async function processCsvLog(fileBuffer) {
    try {
      const results = [];
  
      // Create a readable stream from the buffer and pipe through csv-parser
      await new Promise((resolve, reject) => {
        streamifier.createReadStream(fileBuffer)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve()) // Resolve when the stream ends
          .on('error', (err) => reject(err)); // Reject on error
      });
  
      // After processing the CSV, iterate over the results and save them
      for (const log of results) {
        // Standardize timestamp
        log.timestamp = standardizeTimestamp(log.timestamp);
  
        // Extract relevant fields
        const logFields = extractLogFields(log);

        // Save to database
        await saveLog(logFields);
  
        console.log('CSV log processed and saved:', log);
      }
  
      console.log('CSV log processing completed.');
    } catch (err) {
      console.error('Error processing CSV log:', err);
    }
  }

// Helper function to parse plain text log line
async function processPlainLog(fileBuffer) {
    try {
      const logs = fileBuffer.toString('utf-8').split('\n');  // Split the file by newlines to handle each line as a log
      logs.forEach(logLine => {
        const log = parsePlainLog(logLine);  // Parse the plain text line into log object
        if (log) {
          log.timestamp = standardizeTimestamp(log.timestamp);  // Standardize timestamp
          const logFields = extractLogFields(log);  // Extract relevant log fields

           console.log('Plain text log indexed:', log);  // Logging the index action

          saveLog(logFields);  // Save processed log to storage
        }
      });
    } catch (err) {
      console.error('Error processing Plain Text log:', err);
    }
  }
  
  // Helper function to parse plain text log line
  function parsePlainLog(logLine) {
    const logParts = logLine.split(' ');  // Example of a simple log format: [timestamp] [level] [message]
    if (logParts.length < 3) return null;  // If there aren't enough parts, skip this line
  
    let level = logParts[1].toLowerCase(); // Convert level to lowercase to handle case inconsistency
  
    // Validate and ensure log level is recognized
    if (!['info', 'error', 'warn'].includes(level)) {
      level = 'info';  // Default to 'info' if the level is unrecognized
    }

    const source = logParts.length > 3 ? logParts[2] : 'unknown'; // If there's a third part, assume it's the source
  
    return {
      timestamp: logParts[0],  // Assuming timestamp is the first part
      level: level,             // Set the level from the log (e.g., info, error)
      message: logParts.slice(2).join(' '),  // The rest is the message
      // source: 'unknown',       // Default source, can be modified if source parsing is required
      source: source.trim().toLowerCase()
    };
  }
  

module.exports = {
    processJsonLog,
    processCsvLog,
    processPlainLog,  
  };
  