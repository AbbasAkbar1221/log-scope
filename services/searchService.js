
const Log = require('../models/logModel'); 


// Function to search logs in MongoDB
async function searchLogs(query) {
  try {
    // Building search query dynamically
    const searchQuery = {};

    if (query.message) {
      if (typeof query.message === 'string' && query.message.trim()) {
        // If source is a string, perform case-insensitive regex search
        searchQuery.message = { $regex: query.message.trim(), $options: 'i' };
      } else if (query.message && query.message.$regex) {
        // If source is already a regex object, just use it as is
        searchQuery.message = query.message;
      }
    }

    if (query.level && typeof query.level === 'string' && query.level.trim()) {
      searchQuery.level = query.level.trim();  // No need for regex for exact match
    }

    // if (query.timestamp && typeof query.timestamp === 'string' && query.timestamp.trim()) {
    //   const parsedDate = new Date(query.timestamp.trim());
    //   if (isNaN(parsedDate.getTime())) {
    //     throw new Error("Invalid timestamp format");
    //   }
    //   searchQuery.timestamp = { $gte: parsedDate }; // Assuming you want logs from a certain date onwards
    // } else {
    //   console.log('Invalid timestamp query:', query.timestamp);
    // }

    if (query.timestamp) {
      if (typeof query.timestamp === 'string' && query.timestamp.trim()) {
        // Parse the timestamp from the query
        const parsedDate = new Date(query.timestamp.trim());
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid timestamp format:", query.timestamp);  // More detailed error logging
        } else {
          // If the timestamp is valid, add it to the search query with $gte
          searchQuery.timestamp = { $gte: parsedDate };
        }
      } else if (query.timestamp && query.timestamp.$gte) {
        // If timestamp is already a valid object with $gte, use it as is
        searchQuery.timestamp = query.timestamp;
      }
    } else {
      console.log("Invalid timestamp query:", query.timestamp);
    }
    
    
    
    

   // Check and process the source
   if (query.source) {
    if (typeof query.source === 'string' && query.source.trim()) {
      // If source is a string, perform case-insensitive regex search
      searchQuery.source = { $regex: query.source.trim(), $options: 'i' };
    } else if (query.source && query.source.$regex) {
      // If source is already a regex object, just use it as is
      searchQuery.source = query.source;
    }
  }

  console.log('Search query:', searchQuery);

    // Perform the MongoDB query
    const logs = await Log.find(searchQuery).limit(10); // Limit results to 10 logs
    console.log('Found Logs:', logs);
    return logs;
  } catch (error) {
    console.error('Error searching logs:', error);
    return [];
  }


}

module.exports = { searchLogs };