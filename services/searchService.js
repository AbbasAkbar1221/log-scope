const Log = require("../models/logModel");

// Function to search logs in MongoDB
async function searchLogs(query, limit, offset) {
  try {
    const searchQuery = {};

    if (query.message) {
      if (typeof query.message === "string" && query.message.trim()) {
        searchQuery.message = { $regex: query.message.trim(), $options: "i" };
      } else if (query.message && query.message.$regex) {
        searchQuery.message = query.message;
      }
    }

    if (query.level && typeof query.level === "string" && query.level.trim()) {
      searchQuery.level = query.level.trim(); 
    }

    if (query.timestamp) {
      if (typeof query.timestamp === "string" && query.timestamp.trim()) {
        const parsedDate = new Date(query.timestamp.trim());
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid timestamp format:", query.timestamp);
        } else {
          searchQuery.timestamp = { $gte: parsedDate };
        }
      } else if (query.timestamp && query.timestamp.$gte) {
        searchQuery.timestamp = query.timestamp;
      }
    } else {
      console.log("Invalid timestamp query:", query.timestamp);
    }

    if (query.source) {
      if (typeof query.source === "string" && query.source.trim()) {
        searchQuery.source = { $regex: query.source.trim(), $options: "i" };
      } else if (query.source && query.source.$regex) {
        searchQuery.source = query.source;
      }
    }

    console.log("Search query:", searchQuery);

    const logs = await Log.find(searchQuery)
      .skip(offset)
      .limit(limit)
      .sort({ timestamp: -1 });

    // Count total matching logs for pagination metadata
    const totalLogs = await Log.countDocuments(searchQuery); 
    const totalPages = Math.ceil(totalLogs / limit);
    const currentPage= Math.floor(offset / limit) + 1 

     // Validate page number
     if (currentPage > totalPages) {
      return {
        error: true,
        message: `Page ${currentPage} does not exist. There are only ${totalPages} pages available.`,
        logs: [],
        pagination: {
          totalLogs,
          totalPages,
          currentPage: null,
          perPage: limit,
        },
      };
    }

    // Return the logs and pagination metadata
    return {
      logs,
      pagination: {
        totalLogs,
        totalPages,
        currentPage: Math.floor(offset / limit) + 1, 
        perPage: limit, 
      },
    };
  } catch (error) {
    console.error("Error searching logs:", error);
    return { logs: [], pagination: {} };
  }
}

module.exports = { searchLogs };
