import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImagePreview from "./components/ImagePreview";
import CdnLink from "./components/CdnLink";
import Lightbox from "./components/Lightbox";

const MAX_PHOTOS = 8;

const App = () => {
  const [images, setImages] = useState([]);
  const [cdnLinks, setCdnLinks] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleCopy = useCallback((link) => {
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link copied to clipboard!");
    });
  }, []);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length) {
      const newImages = imageFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setImages((prevImages) => {
        const combinedImages = [...prevImages, ...newImages];
        if (combinedImages.length > MAX_PHOTOS) {
          toast.error(`Maximum of ${MAX_PHOTOS} photos allowed.`);
          return combinedImages.slice(0, MAX_PHOTOS);
        }
        return combinedImages;
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } else {
      toast.error("Only images are allowed.");
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    toast("Image removed.", { icon: "🗑️" });
  };

  const handleRemoveAllImages = () => {
    setImages([]);
    toast("All images removed.", { icon: "🗑️" });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    if (images.length === 0) return;

    const formData = new FormData();
    images.forEach(({ file }) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        "https://image-cdn-service-tpa8.vercel.app/api/v1/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Images uploaded successfully!");
      setCdnLinks((prevLinks) => [...prevLinks, ...response.data.urls]);

      setImages([]);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("Error uploading images.");
      }
      console.error("Error uploading images:", error);
    }
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <h1 className="text-4xl font-extrabold text-white mb-8">
        Upload Images (Max 8)
      </h1>

      <div className="w-full max-w-md">
        <div
          className="flex flex-col items-center justify-center w-full h-60 bg-white border-4 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-indigo-700 transition-all shadow-xl cursor-pointer"
          onClick={openFileInput}
        >
          {images.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {images.map((preview, index) => (
                <ImagePreview
                  key={index}
                  preview={preview}
                  index={index}
                  onRemove={handleRemoveImage}
                  onOpen={openLightbox}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-gray-500 mt-2">
                Click to upload images (Max 8)
              </p>
            </div>
          )}
        </div>
        <input
          id="image_input"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
          multiple
        />
      </div>

      {images.length > 0 && (
        <div className="flex gap-8">
          <button
            onClick={handleRemoveAllImages}
            className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md"
          >
            Remove All Images
          </button>
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md"
          >
            Submit Images
          </button>
        </div>
      )}

      <div className="flex flex-col items-center mt-8">
        {cdnLinks.length > 0 && (
          <div className="w-full max-w-lg space-y-4">
            {cdnLinks.map((link, index) => (
              <CdnLink key={index} link={link} onCopy={handleCopy} />
            ))}
          </div>
        )}
      </div>

      {lightboxImage && (
        <Lightbox image={lightboxImage} onClose={closeLightbox} />
      )}
    </div>
  );
};

export default App;
