import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const App = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null); // Use ref to access the input element

  const [textToCopy, setTextToCopy] = useState("CDN link will appear here");
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Text copied to clipboard!");
    });
  };

  // Clean up the URL.createObjectURL after unmounting
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Image uploaded successfully!");
      console.log("Image uploaded successfully:", response.data);
      setTextToCopy(response.data.url);
      setSelectedImage(null);
      setImagePreview(null);
      fileInputRef.current.value = null; // Clear the file input value
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("Error uploading image.");
      }
      console.error("Error uploading image:", error);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage("");
    setImagePreview("");
    fileInputRef.current.value = null; // Clear the file input value
    toast.error("Image removed.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <h1 className="text-4xl font-extrabold text-white mb-8 shadow-lg">
        Upload an Image
      </h1>

      <div className="w-full max-w-sm">
        <label htmlFor="image_input" className="block mb-4 cursor-pointer">
          <div className="flex flex-col items-center justify-center w-full h-60 bg-white border-4 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-indigo-700 transition-all shadow-xl">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Selected"
                className="h-full w-full object-contain rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-gray-500 mt-2">Click to upload an image</p>
              </div>
            )}
          </div>
        </label>
        <input
          id="image_input"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef} // Attach ref to input element
          onChange={handleImageChange}
        />
      </div>

      {selectedImage && (
        <div className="flex gap-8">
          <button
            onClick={handleRemoveImage}
            className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md"
          >
            Remove Image
          </button>
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md"
          >
            Submit Image
          </button>
        </div>
      )}
      <div className="flex flex-col items-center mt-8">
        {/* <label htmlFor="cdn" className="text-white text-lg mb-2">
          CDN Link
        </label> */}
        <div className="flex items-center bg-white p-2 rounded-lg shadow-lg">
          <input
            type="text"
            id="cdn"
            value={textToCopy}
            readOnly
            className="w-full text-gray-800 p-2 rounded-lg focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
