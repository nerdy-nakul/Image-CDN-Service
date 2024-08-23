import React from 'react';

const Lightbox = ({ image, onClose }) => (
  <div
    className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div className="relative max-w-md w-full p-4 bg-white rounded-lg">
      <img
        src={image}
        alt="Lightbox"
        className="max-w-full max-h-96 mx-auto rounded-lg"
      />
      <button
        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        ✕
      </button>
    </div>
  </div>
);

export default Lightbox;
