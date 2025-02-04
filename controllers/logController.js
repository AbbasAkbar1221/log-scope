const csvParser = require('csv-parser');
const { standardizeTimestamp, extractLogFields } = require('../services/logProcessingService');
const { saveLog } = require('../services/storageService');
const streamifier = require('streamifier');

async function processJsonLog(fileBuffer) {
    try {
      const logs = JSON.parse(fileBuffer.toString('utf-8'));
  
      
      if (!Array.isArray(logs)) {
        console.error('Expected a JSON array of logs, but got:', logs);
        return;
      }
  
      console.log('Number of logs to process:', logs.length);
  
      
      for (const log of logs) {
        
        if (!log.timestamp || !log.level || !log.message) {
          console.error('Skipping invalid log:', log);
          continue;
        }

        log.source = log.source && log.source.trim() ? log.source.trim().toLowerCase() : 'unknown';
  
        
        log.timestamp = standardizeTimestamp(log.timestamp);
       
        
        await saveLog(log);
        console.log('Log saved:', log);
      }
    } catch (error) {
      console.error('Error processing JSON logs:', error.message);
    }
  }
  
  

async function processCsvLog(fileBuffer) {
    try {
      const results = [];
  
      
      await new Promise((resolve, reject) => {
        streamifier.createReadStream(fileBuffer)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve()) 
          .on('error', (err) => reject(err)); 
      });
  
      
      for (const log of results) {
        
        log.timestamp = standardizeTimestamp(log.timestamp);
  
        
        const logFields = extractLogFields(log);

        
        await saveLog(logFields);
  
        console.log('CSV log processed and saved:', log);
      }
  
      console.log('CSV log processing completed.');
    } catch (err) {
      console.error('Error processing CSV log:', err);
    }
  }


async function processPlainLog(fileBuffer) {
    try {
      const logs = fileBuffer.toString('utf-8').split('\n');  
      logs.forEach(logLine => {
        const log = parsePlainLog(logLine);  
        if (log) {
          log.timestamp = standardizeTimestamp(log.timestamp);  
          const logFields = extractLogFields(log); 

           console.log('Plain text log indexed:', log);  

          saveLog(logFields);  
        }
      });
    } catch (err) {
      console.error('Error processing Plain Text log:', err);
    }
  }
  
  
  function parsePlainLog(logLine) {
    const logParts = logLine.split(' ');  
    if (logParts.length < 3) return null;  
  
    let level = logParts[1].toLowerCase(); 
  
    if (!['info', 'error', 'warn'].includes(level)) {
      level = 'info';  
    }

    const source = logParts.length > 3 ? logParts[2] : 'unknown'; 
  
    return {
      timestamp: logParts[0],  
      level: level,             
      message: logParts.slice(2).join(' '),  
      source: source.trim().toLowerCase()
    };
  }
  

module.exports = {
    processJsonLog,
    processCsvLog,
    processPlainLog,  
  };
  