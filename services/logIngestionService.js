const multer = require('multer');

// Memory storage configuration for multer
const storage = multer.memoryStorage(); 

const upload = multer({ storage,
    limits:{fileSize: 5*1024*1024},

}); // Multer middleware for handling file uploads

module.exports = upload;
