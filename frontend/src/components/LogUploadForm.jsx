import React, { useState } from 'react';

const LogUploadForm = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleFileChange = (e) => {
    const newFiles = [...files, ...Array.from(e.target.files)];
    setFiles(newFiles);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage('Please select at least one file to upload');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('logs', file); 
    });

    try {
      const response = await fetch(`${backendURL}/logs/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logs');
      }

      setMessage('Log files uploaded successfully');
      setFiles([]);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Upload Log Files
      </h2>
      <form onSubmit={handleFileUpload} className="space-y-4">
        <div>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            className="block w-full text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Upload Logs
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center ${
            message.startsWith('Error') ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {message}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Selected Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LogUploadForm;
