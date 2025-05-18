"use client";
import { useEffect } from "react";

export default function ViewSeo({ seoData, onClose }) {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === "modal-overlay") {
        onClose();
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>
        <h2 className="text-lg font-bold text-gray-800 mb-4">SEO Metadata</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Page URL
            </label>
            <p className="w-full p-2 border rounded-md bg-gray-100">
              {seoData?.pageUrl}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <p className="w-full p-2 border rounded-md bg-gray-100">
              {seoData?.title}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <p className="w-full p-2 border rounded-md bg-gray-100">
              {seoData?.meta_description}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Keywords
            </label>
            <p className="w-full p-2 border rounded-md bg-gray-100">
              {seoData?.keywords}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
