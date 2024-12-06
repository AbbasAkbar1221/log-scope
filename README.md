# 🌟 Log Scope 

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)
![NPM](https://img.shields.io/badge/NPM-CB3837?logo=npm&logoColor=white&style=for-the-badge)

---

## 📋 About the Project
This project is a log processing and indexing system built using Node.js and MongoDB. It allows users to upload, parse, and analyze log files in various formats (JSON, CSV, and plain text). The logs are processed to standardize timestamps, validate log levels, and store them in a MongoDB database. The project also includes functionality for searching logs by level, message and other relevant fields.

## ✨ Features
- **File Parsing**: Supports log files in JSON, CSV, and plain text formats.
- **Standardization**: Standardizes timestamps using `moment` and validates log levels.
- **Database Storage**: Logs are stored in MongoDB with fields such as `timestamp`, `level`, `message`, `source`.
- **Search and Indexing**: Efficiently search and filter logs in the database using timestamp ranges and other filters.
- **File Upload**: Allows users to upload log files using `multer` and process them in various formats.
-  **Pagination**: Implements pagination for search results, making it easier for users to navigate large datasets efficiently.

 ## ⚙️ Setup Instructions
 Follow these steps to set up the project locally on your machine and use Postman to interact with the API:

To run the application locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/AbbasAkbar1221/log-scope.git
2. Navigate to the project directory:
    ```bash
   cd log-scope
3. Install dependencies:
   Ensure you have Node.js and npm installed. Then, install the required dependencies:
    ```bash
   npm install
4. Set Up MongoDB

    This project uses MongoDB for storing logs. You have two options to set up MongoDB:

    - **MongoDB Atlas**:  use MongoDB Atlas by creating a cluster and obtaining your connection string.
5. Configure Environment Variables:
   
    Create a .env file in the root directory of the project add the following environment variables:
     ```bash
   DB_URI = yourMongooseURI
   PORT=4000
6. Start the server:
   ```bash
   nodemon app.js
   
## 📄 API Documentation

1. **Using Postman to Interact with the API**
   
   Once the server is running, you can use Postman to interact with the API.
   
   1.1 **Upload a Log File (POST Request)**

     **Open Postman**.

      **Set the request URL** to:
       http://localhost:4000/logs/upload

      **Set the request method** to `POST`.

      **Go to the "Body" tab** and choose **form-data**.
   
      Add a new field with the key **logs** and choose a log file (JSON, CSV, or plain text) to upload.

      Click **Send** to upload the file.


      1.2 **Search Logs (GET Request)**
   
     To search for logs, make a GET request to **http://localhost:4000/logs/search** with query parameters for filters (such as  level, source, message or timestamp).

     **Open Postman**.

      **Set the request URL** to:
       http://localhost:4000/logs/search

      **Set the request method** to `GET`.

      Enter the URL with query parameters (for example: http://localhost:4000/logs/search?level=error).

      Click **Send** to retrieve the logs.

## 📱 Frontend (React App)

The React App serves as the user interface for interacting with the Log Analyzer backend. It allows users to upload log files, search and filter logs based on various criteria (level, source, message, timestamp), and view results dynamically.

  🔧 **How to Use the React App**

   **Start the React App**: Once the backend is running, you can start the React app by navigating to the frontend directory and running:

  Start the server(Frontend):
   **npm run start**

   **Upload Log Files**: Use the "Upload" button on the frontend to select a log file (JSON, CSV, or plain text) and upload it to the backend. The uploaded logs will then 
     be processed and stored in MongoDB.

   **Search and Filter Logs**: The React app allows users to search logs by log level (error, info, etc.), source, timestamp or message. Simply enter your search criteria 
     in the provided input fields and hit the search button to filter the logs.

   **View Logs**: After uploading and searching logs, the filtered results will be displayed in the React app, allowing you to review and analyze the logs in real-time

## 📑 Sample Log Formats Supported

The system supports the following log formats:

1. JSON Format:

     ```json
   {
    "timestamp": "2024-12-01T10:00:00Z",
    "level": "error",
    "message": "User logged in",
    "source": "auth-service"
   }
   
2. CSV Format:
     ```csv
    timestamp,level,message,source
    2024-12-01T10:00:00Z,info,User logged in,auth-service
     
3. Plain Text Format:
   ```plain
   2024-12-02T10:00:00Z info User logged in successfully from the web


## 🚀 Future Improvements
- **Search Result Highlighting**: Introduce search result highlighting, where the matched keywords or terms in the log entries are visually highlighted. This feature will help users quickly identify relevant information and improve the efficiency of reviewing search results.
- **User Authentication**: Implement authentication and authorization for users, allowing them to access logs securely and manage log data in a more controlled environment.
- **Elasticsearch/Solr Integration**: Integrate the project with Elasticsearch or Solr for advanced search and indexing. This will significantly improve the search performance and scalability of the application, especially for large datasets.



