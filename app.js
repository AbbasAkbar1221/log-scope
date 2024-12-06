const express = require("express");
const bodyParser = require("body-parser");
const logRoutes = require("./routes/logRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Initialize Express app
const app = express();
app.use(cors({
  origin: 'http://localhost:3000'
}));

const port = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes for handling log-related operations
app.use("/logs", logRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);  // Exit the process if MongoDB connection fails
  });

// Start server and listen for requests
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});