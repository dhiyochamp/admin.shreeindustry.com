import { generateUUID } from "@/lib/helperFunctions/genrateIds";
import { uploadImageToSupabase } from "@/lib/helperFunctions/uploadImageToSupabase";
import {
  addSubCategory,
  fetchSubCategory,
  updateSubCategory,
} from "@/redux/dataSlice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AddCategoryModal({ isOpen, setIsOpen, subCatData }) {
  const dispatch = useDispatch();
  const { allCategory } = useSelector((state) => state.data);
  // State to manage form fields
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set initial values if editing an existing category
  useEffect(() => {
    if (subCatData) {
      setName(subCatData.name || "");
      setPath(subCatData.pathName || "");
      setCategory(subCatData.category || "");
      setImageUrl(subCatData.imageUrl || "");
    } else {
      setName("");
      setPath("");
      setCategory("");
      setImageUrl("");
    }
  }, [subCatData]);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedUrl = await uploadImageToSupabase(file);
      setImageUrl(uploadedUrl);
    }
  };

  // Handle submit (Add or Update)
  const handleSubmit = async () => {
    if (!name || !category) {
      alert("Category name & category cannot be empty!");
      return;
    }

    setIsLoading(true);

    const newCategory = {
      id: subCatData?.id || generateUUID(), // Use existing ID if updating
      name,
      pathName: path,
      category,
      imageUrl,
    };

    try {
      if (subCatData) {
        await dispatch(updateSubCategory(newCategory)).unwrap();
      } else {
        await dispatch(addSubCategory(newCategory)).unwrap();
      }
      setIsOpen(false); // Close modal after successful submission
      await dispatch(fetchSubCategory()).unwrap();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={() => setIsOpen(false)}
      >
        <div
          className="bg-white p-6 rounded-lg w-96"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-bold mb-4">
            {subCatData ? "Edit Sub-Category" : "Add Sub-Category"}
          </h2>

          {/* Category Name Input */}
          <input
            type="text"
            placeholder="Category Name"
            className="w-full p-2 border rounded mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Path Name"
            className="w-full p-2 border rounded mb-4"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />

          {/* Category Type Dropdown */}
          <select
            className="w-full p-2 border rounded mb-4"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select Category Type
            </option>
            {allCategory?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Image Upload */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Category Preview"
              className="w-full h-40 object-cover mb-4 rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full object-cover rounded"
          />

          {/* Add/Update Category Button */}
          <button
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4"
            onClick={handleSubmit}
          >
            {isLoading
              ? "Saving..."
              : subCatData
              ? "Update Category"
              : "Add Category"}
          </button>
        </div>
      </div>
    )
  );
}
