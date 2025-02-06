const express = require("express");
const bodyParser = require("body-parser");
const logRoutes = require("./routes/logRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/logs", logRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);  
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});