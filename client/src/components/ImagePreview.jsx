import React from 'react';

const ImagePreview = ({ preview, index, onRemove, onOpen }) => (
  <div className="relative group">
    <img
      src={preview.url}
      alt={`Selected ${index + 1}`}
      className="w-24 object-cover rounded-lg cursor-pointer transition-transform transform hover:scale-105"
      onClick={(event) => {
        event.stopPropagation();
        onOpen(preview.url);
      }}
    />
    <button
      onClick={(event) => {
        event.stopPropagation();
        onRemove(index);
      }}
      className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1"
      aria-label="Remove image"
    >
      ✕
    </button>
  </div>
);

export default ImagePreview;
