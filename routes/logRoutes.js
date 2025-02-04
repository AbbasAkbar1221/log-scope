const express = require("express");
const router = express.Router();
const upload = require("../services/logIngestionService");
const {
  processJsonLog,
  processCsvLog,
  processPlainLog,
} = require("../controllers/logController"); 
const { searchLogs } = require("../services/searchService"); 

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
          await processJsonLog(file.buffer);
        } else if (
          file.mimetype === "text/csv" ||
          file.originalname.endsWith(".csv")
        ) {
          await processCsvLog(file.buffer); 
        } else if (
          file.mimetype === "text/plain" ||
          file.originalname.endsWith(".txt")
        ) {
          await processPlainLog(file.buffer); 
        } else {
          
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

  try {
    
    const limit = parseInt(req.query.limit) || 10; 
    const page = parseInt(req.query.page) || 1; 
    const offset = (page - 1) * limit;

    const logs = await searchLogs(req.query, limit, offset); 

    console.log("Found Logs:", logs); 
    res.json(logs); 
  } catch (err) {
    console.error("Error searching logs:", err);

    res.status(500).send("Error searching logs.");
  }
});

module.exports = router;
