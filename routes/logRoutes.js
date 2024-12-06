const express = require("express");
const router = express.Router();
const upload = require("../services/logIngestionService"); // Multer configuration for uploading
const {
  processJsonLog,
  processCsvLog,
  processPlainLog,
} = require("../controllers/logController"); // Log processing methods
const { searchLogs } = require("../services/searchService"); // Search service

// Upload logs
router.post("/upload", upload.array("logs", 10), async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  try {
    // Process each file based on the MIME type or file extension
    await Promise.all(
      files.map(async (file) => {
        if (
          file.mimetype === "application/json" ||
          file.originalname.endsWith(".json")
        ) {
          await processJsonLog(file.buffer); // Process JSON log from buffer
        } else if (
          file.mimetype === "text/csv" ||
          file.originalname.endsWith(".csv")
        ) {
          await processCsvLog(file.buffer); // Process CSV log from buffer
        } else if (
          file.mimetype === "text/plain" ||
          file.originalname.endsWith(".txt")
        ) {
          await processPlainLog(file.buffer); // Process plain text log from buffer
        } else {
          // If the file type is not supported, log an error
          console.error("Unsupported file type:", file.mimetype);
          return res
            .status(400)
            .send(`Unsupported file type: ${file.mimetype}`);
        }
      })
    );

    res.send("Log files uploaded and processed successfully.");
  } catch (err) {
    console.error("Error processing log files:", err);
    res.status(500).send("Error processing log files.");
  }
});

router.get("/search", async (req, res) => {
  console.log("Request Query:", req.query);
  // Log the incoming query parameters

  try {
    // Get limit and page parameters from the query string (with default values if not provided)
    const limit = parseInt(req.query.limit) || 10; // Default to 10 if no limit is provided
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is provided

    // Calculate offset based on the current page and limit
    const offset = (page - 1) * limit;

    const logs = await searchLogs(req.query, limit, offset); // Search logs using query parameters

    console.log("Found Logs:", logs); // Log the result for debugging
    res.json(logs); // Return the found logs
  } catch (err) {
    console.error("Error searching logs:", err);

    res.status(500).send("Error searching logs.");
  }
});

module.exports = router;
