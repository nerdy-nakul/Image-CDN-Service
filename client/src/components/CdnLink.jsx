import React from 'react';

const CdnLink = ({ link, onCopy }) => (
  <div className="flex items-center bg-white p-2 rounded-lg shadow-lg">
    <input
      type="text"
      value={link}
      readOnly
      className="w-full text-gray-800 p-2 rounded-lg focus:outline-none"
    />
    <button
      onClick={() => onCopy(link)}
      className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
    >
      Copy
    </button>
  </div>
);

export default CdnLink;
