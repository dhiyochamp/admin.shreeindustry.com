"use client";

import { uploadImageToSupabase } from "@/lib/helperFunctions/uploadImageToSupabase";
import {
  fetchBlogs,
  fetchCategory,
  fetchSubCategory,
  insertBlog,
  updateBlog,
} from "@/redux/dataSlice";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AddBlog({ isOpen, setIsOpen, blogData, setBlogData }) {
  const dispatch = useDispatch();
  const { allSubCategory } = useSelector((state) => state.data);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    image: "",
    heading: "",
    description: "",
    category: "",
  });

  const [errors, setErrors] = useState({
    image: "",
    heading: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    if (blogData) {
      setFormData({
        image: blogData.image || "",
        heading: blogData.heading || "",
        description: blogData.description || "",
        category: blogData.category || "",
      });
    }
  }, [blogData]);
  useEffect(() => {
    const fetchCategories = async () => {
      //   await dispatch(fetchCategory()).unwrap();
      await dispatch(fetchSubCategory()).unwrap();
      await dispatch(fetchBlogs({ search: "" })).unwrap();
    };
    fetchCategories();
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {
      image: formData.image ? "" : "Image is required",
      heading: formData.heading ? "" : "Heading is required",
      description: formData.description ? "" : "Description is required",
      category: formData.category ? "" : "Category is required",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imgUrl = await uploadImageToSupabase(file); // Assuming this returns the URL
    if (imgUrl) {
      setFormData((prev) => ({ ...prev, image: imgUrl }));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      user_id: user?.id,
    };
    setIsLoading(true);
    try {
      if (blogData) {
        // Update blog
        await dispatch(updateBlog({ id: blogData.id, data: payload })).unwrap();
        await dispatch(fetchBlogs({ search: "" })).unwrap();
        setBlogData(null);
      } else {
        // Add new blog
        await dispatch(insertBlog(payload)).unwrap();
        await dispatch(fetchBlogs({ search: "" })).unwrap();
      }
      // Reset form
      setFormData({
        image: "",
        heading: "",
        description: "",
        category: "",
      });
    } catch (error) {
      console.error("Error submitting blog:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  const handleClose = () => {
    setIsOpen(false);
    if (blogData) setBlogData(null);
  };
  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        onClick={() => setIsOpen(true)}
      >
        Add Blog
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {blogData ? "Update Blog" : "Save Blog"}
            </h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Blog Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Blog Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded-md"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Uploaded Preview"
                    className="w-full h-20 object-cover mt-2 rounded"
                  />
                )}
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image}</p>
                )}
              </div>

              {/* Blog Heading */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Blog Heading
                </label>
                <input
                  type="text"
                  value={formData.heading}
                  onChange={(e) => handleInputChange("heading", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Blog Heading"
                />
                {errors.heading && (
                  <p className="text-red-500 text-sm">{errors.heading}</p>
                )}
              </div>

              {/* Blog Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Blog Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter Blog Description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Category Dropdown */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">-- Select Category --</option>

                  {/* Map all subcategories */}
                  {allSubCategory?.map((subCat) => (
                    <option key={subCat.id} value={subCat?.id}>
                      {subCat?.name}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  {isLoading
                    ? "loading..."
                    : blogData
                    ? "Update Blog"
                    : "Save Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
