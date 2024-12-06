import React, { useState, useEffect } from 'react';

const LogSearchForm = () => {
  const [searchParams, setSearchParams] = useState({
    level: '',
    message: '',
    timestamp: '',
    source: '',
  });
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages
  const logsPerPage = 5; // Set how many logs per page

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleSearch = async (e) => {
    if(e){
      e.preventDefault();
    }
    

    if (!searchParams.level && !searchParams.message && !searchParams.timestamp &&!searchParams.source) {
      setMessage('Please enter at least one search parameter.');
      logs.length=0;
      return;
    }

    const query = new URLSearchParams(searchParams).toString();

    try {
      const response = await fetch(`http://localhost:4000/logs/search?${query}&page=${currentPage}&limit=${logsPerPage}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const result = await response.json();
      setLogs(result.logs);
      setMessage('Logs fetched successfully');
      setTotalPages(result.pagination.totalPages); // Update total pages

      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setLogs([]);
    }
  };

   // Handle pagination buttons
   const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (currentPage) {
      handleSearch(); // Trigger the search when the page is updated
    }
  }, [currentPage]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Search Logs</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium">Level:</label>
          <input
            type="text"
            name="level"
            value={searchParams.level}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., error, info"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">Message:</label>
          <input
            type="text"
            name="message"
            value={searchParams.message}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., Connection timeout"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">Timestamp:</label>
          <input
            type="text"
            name="timestamp"
            value={searchParams.timestamp}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., 2023-12-04"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">Source:</label> {/* Add source input */}
          <input
            type="text"
            name="source"
            value={searchParams.source}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., server1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>
    
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}

      <h3 className="text-xl font-semibold mt-8 text-gray-700">Search Results</h3>
      {logs.length > 0 ? (
        <div className="mt-4 space-y-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-md shadow-md border border-gray-200"
            >
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(log, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No logs found.</p>
      )}
       {/* Pagination Controls */}
       <div className="flex justify-between mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="self-center text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
    
  );
};

export default LogSearchForm;

