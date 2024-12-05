const multer = require('multer');
const path = require('path');

// Memory storage configuration for multer
const storage = multer.memoryStorage();  // Use memory storage to handle file buffers

const upload = multer({ storage }); // Multer middleware for handling file uploads

module.exports = upload;
