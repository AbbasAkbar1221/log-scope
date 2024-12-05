// import React from 'react';
// import LogUploadForm from './components/LogUploadForm';
// import LogSearchForm from './components/LogSearchForm';

// const App = () => {
//   return (
//     <div>
//       <h1 className=''>Log File Manager</h1>
//       <LogUploadForm />
//       <LogSearchForm />
//     </div>
//   );
// };

// export default App;


import React from 'react';
import LogUploadForm from './components/LogUploadForm';
import LogSearchForm from './components/LogSearchForm';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
        Log File Manager
      </h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-md p-6">
          <LogUploadForm />
        </div>
        <div className="bg-white shadow-lg rounded-md p-6">
          <LogSearchForm />
        </div>
      </div>
    </div>
  );
};

export default App;
