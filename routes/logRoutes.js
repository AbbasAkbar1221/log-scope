const express = require('express');
const router = express.Router();
const upload = require('../services/logIngestionService');  // Multer configuration for uploading
const { processJsonLog, processCsvLog, processPlainLog } = require('../controllers/logController');  // Log processing methods
const { searchLogs } = require('../services/searchService');  // Search service
const Log = require('../models/logModel'); 

// Upload logs
router.post('/upload', upload.array('logs', 10), async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  try {
    // Process each file based on the MIME type or file extension
    await Promise.all(files.map(async (file) => {
      if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
        await processJsonLog(file.buffer);  // Process JSON log from buffer
      } else if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        await processCsvLog(file.buffer);  // Process CSV log from buffer
      } else if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
        await processPlainLog(file.buffer);  // Process plain text log from buffer
      } else {
        // If the file type is not supported, log an error
        console.error('Unsupported file type:', file.mimetype);
        return res.status(400).send(`Unsupported file type: ${file.mimetype}`);
      }
    }));

    res.send('Log files uploaded and processed successfully.');
  } catch (err) {
    console.error('Error processing log files:', err);
    res.status(500).send('Error processing log files.');
  }
});


router.get('/search', async (req, res) => {
  console.log('Request Query:', req.query);
    // Log the incoming query parameters


    try {
      // const query = {
      //   message: req.query.message,  
      //   level: req.query.level,      
      //   timestamp: req.query.timestamp     
      // };

      const query = {};

    // Check if message query parameter exists and is non-empty
    if (req.query.message && req.query.message.trim()) {
      query.message = { $regex: req.query.message, $options: 'i' }; // Case-insensitive match
    }

    // Check if level query parameter exists and is non-empty
    if (req.query.level && req.query.level.trim()) {
      query.level = req.query.level; // Exact match
    }

    // Check if timestamp query parameter exists and is valid
    if (req.query.timestamp && req.query.timestamp.trim()) {
      if (isNaN(new Date(req.query.timestamp).getTime())) {
        throw new Error("Invalid timestamp format");
      }
      query.timestamp = { $gte: new Date(req.query.timestamp) }; // Timestamp greater than or equal to
    }

    // Check if source query parameter exists and is non-empty
    if (req.query.source && req.query.source.trim()) {
      query.source = { $regex: req.query.source.trim(), $options: 'i' }; // Case-insensitive match
    }
    
      console.log('Formatted Query:', query);

    const logs = await searchLogs(query);  // Search logs using query parameters
    console.log('Found Logs:', logs);  // Log the result for debugging
    res.json(logs);  // Return the found logs
     } catch (err) {
    console.error('Error searching logs:', err);

    res.status(500).send('Error searching logs.');
  }
});


// router.get('/search', async (req, res) => {
//   console.log('Request Query:', req.query);
  
//   // Extract query parameters (message, level, timestamp, page, limit)
//   const { message, level, timestamp, page = 1, limit = 10 } = req.query;

//   // Log the formatted query for debugging
//   const query = {};
//   if (message) query.message = { $text: { $search: message } };  // Full-text search on message
//   if (level) query.level = level;
//   if (timestamp) query.timestamp = { $gte: new Date(timestamp) };  // Filter by timestamp

//   console.log('Formatted Query:', query);

//   try {
//     // Calculate pagination skip value based on the page number and limit
//     const skip = (page - 1) * limit;

//     // Fetch the logs with pagination (skip and limit)
//     const logs = await Log.find(query) // Query the database using the formatted query
//       .skip(skip)  // Skip the results based on the current page
//       .limit(Number(limit))  // Limit the results per page
//       .sort({ timestamp: -1 });  // Sort logs by timestamp in descending order (latest first)

//     // Get the total count of logs that match the query for pagination
//     const totalLogs = await Log.countDocuments(query);  // Total number of logs matching the query

//     // Calculate the total number of pages
//     const totalPages = Math.ceil(totalLogs / limit);

//     console.log('Found Logs:', logs);  // Log the result for debugging

//     // Return the logs along with pagination information
//     res.json({
//       logs,           // The logs for the current page
//       totalLogs,      // Total number of logs that match the query
//       totalPages,     // Total number of pages
//       currentPage: page,  // The current page
//       perPage: limit  // The number of logs per page
//     });
//   } catch (err) {
//     console.error('Error searching logs:', err);
//     res.status(500).send('Error searching logs.');
//   }
// });


module.exports = router;
