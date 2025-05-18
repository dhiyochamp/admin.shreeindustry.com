import {
  bulkUpdateProducts,
  fetchCategory,
  fetchSubCategory,
} from "@/redux/dataSlice";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

export default function EditEvent({
  isModalOpen,
  onClose,
  setSelectedIds,
  selectedIds,
}) {
  const { allCategory, allSubCategory } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const [inventory, setInventory] = useState("");
  const [outOfStock, setOutOfStock] = useState(false);
  const [productType, setProductType] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCategory()).unwrap();
        await dispatch(fetchSubCategory()).unwrap();
      } catch (error) {
        console.log(error, "error while fetching data");
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (!category) {
      setFilteredSubCategories([]);
      setSubCategory(""); // Reset subcategory if category is cleared
      return;
    }

    const filtered = allSubCategory?.filter((sub) => sub.category === category);
    setFilteredSubCategories(filtered);
  }, [category, allSubCategory]);

  const handleSubmit = async () => {
    if (category && !subCategory) {
      alert("Please select a subcategory.");
      return;
    }

    const formData = {
      inventory,
      outOfStock: outOfStock,
      category_type: productType,
      category,
      subCategory,
    };
    try {
      setIsLoading(true);
      await dispatch(
        bulkUpdateProducts({
          productIds: selectedIds, // Ensure this is an array of valid product IDs
          updateData: formData,
        })
      ).unwrap();

      onClose(); // Close the modal after success
    } catch (error) {
      console.error(error, "error while updating");
      alert("Failed to update products.");
    } finally {
      setIsLoading(false);
      setSelectedIds([]);
    }
  };

  const handleCancel = () => {
    setInventory("");
    setOutOfStock(false);
    setProductType("");
    setCategory("");
    setSubCategory("");
    setFilteredSubCategories([]);
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed top-[5%] left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md w-[30%] z-50 py-8 px-5 font-inter">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <IoClose size={24} />
        </button>
        <h1 className="text-lg font-semibold mb-5 py-1 border-b">Edit </h1>

        {/* Inventory Input */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Inventory</label>
          <input
            type="number"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            placeholder="Enter Inventory Count"
            className="py-1 w-full rounded focus:outline-none border focus:border-black text-sm px-2"
          />
        </div>

        {/* Out of Stock Toggle */}
        <div className="space-y-2 my-5">
          <label className="flex items-center gap-2 cursor-pointer">
            Out of Stock
          </label>
          <div
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
              outOfStock ? "bg-green-400" : "bg-gray-300"
            }`}
            onClick={() => setOutOfStock(!outOfStock)}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                outOfStock ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>

        {/* Product Type Radio Buttons */}
        <div className="mt-4">
          <label className="text-sm font-medium">Product Type</label>
          <div className="flex gap-5 text-nowrap mt-4 text-sm">
            {["trending", "hallOfFame", "feature", "dealOfDay"].map((type) => (
              <label key={type} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="productType"
                  value={type}
                  onChange={(e) => setProductType(e.target.value)}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Category & Subcategory */}
        <div className="mt-4">
          <label className="text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-1 w-full rounded focus:outline-none border focus:border-black text-sm px-2"
          >
            <option value="">Select Category</option>
            {allCategory?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {category && (
          <div className="mt-3">
            <label className="text-sm font-medium">Subcategory</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="py-1 w-full rounded focus:outline-none border focus:border-black text-sm px-2"
            >
              <option value="">Select Subcategory</option>
              {filteredSubCategories?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-6 mt-4">
          <button
            onClick={handleCancel}
            className="px-5 py-1.5 rounded text-[#223142] bg-[#F0F0F0] text-sm font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-1.5 rounded bg-[#223142] text-white text-sm font-medium hover:bg-[#223142]/80"
          >
            {isLoading ? "loading..." : "Update"}
          </button>
        </div>
      </div>
    </>
  );
}
