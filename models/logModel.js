// models/logModel.js
const mongoose = require('mongoose');

// Log schema definition

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  level: { type: String, default: 'info' },
  message: { type: String, required: true, default: 'No message provided' },
  source: { type: String, default: 'unknown' },
  client_ip: { type: String },  // For Nginx or access logs to store the client IP
  service_name: { type: String },  // To store service name (e.g., "user-api")
}, { timestamps: true });

// Create Log model
const Log = mongoose.model('Log', logSchema);

module.exports = Log;
