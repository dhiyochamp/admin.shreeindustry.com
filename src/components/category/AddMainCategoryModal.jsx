"use client";

import { generateUUID } from "@/lib/helperFunctions/genrateIds";
import {
  addCategory,
  fetchCategory,
  updateMainCategory,
} from "@/redux/dataSlice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AddMainCategoryModal({
  setIsOpen,
  setCatData,
  catData,
}) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(catData?.name || "");
    setPath(catData?.pathName || "");
  }, [catData]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    setIsLoading(true);
    const categoryCreate = {
      id: catData?.id || generateUUID(), // Generate new ID if creating a new category
      name,
      pathName: path,
    };

    try {
      if (catData) {
        await dispatch(updateMainCategory(categoryCreate)).unwrap();
      } else {
        await dispatch(addCategory(categoryCreate)).unwrap();
      }
      setIsOpen(false); // Close modal after success
      setCatData(null); // Reset catData after update
      await dispatch(fetchCategory()).unwrap();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => {
        setIsOpen(false);
        setCatData(null); // Ensure reset on close
      }}
    >
      <div
        className="bg-white p-6 rounded-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">
          {catData ? "Update Main-Category" : "Add Main-Category"}
        </h2>

        {/* Category Name Input */}
        <input
          type="text"
          placeholder="Category Name"
          className="w-full p-2 border rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Path Name Input */}
        <input
          type="text"
          placeholder="Path Name"
          className="w-full p-2 border rounded mb-4"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />

        {/* Add/Update Category Button */}
        <button
          onClick={handleSubmit}
          className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : catData
            ? "Update Category"
            : "Add Category"}
        </button>
      </div>
    </div>
  );
}
