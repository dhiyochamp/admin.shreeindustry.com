"use client";

import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import AddCategoryModal from "@/components/category/AddCategoryModal";
import DeleteConfirmModal from "@/components/category/DeleteConfirmModal";
import CategoryCard from "@/components/category/CategoryCard";
import AddMainCategoryModal from "@/components/category/AddMainCategoryModal";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMainCategory,
  deleteSubCategory,
  fetchCategory,
  fetchSubCategory,
} from "@/redux/dataSlice";
import { CiEdit, CiSearch } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

export default function CategoryPage({ toggleView, setViewData }) {
  const dispatch = useDispatch();
  const { allCategory, allSubCategory } = useSelector((state) => state.data);

  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteType, setDeleteType] = useState("sub");
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category
  const [openMainCat, setOpenMainCat] = useState(false);
  const [filterId, setFilterId] = useState(""); // Store the category ID for filtering
  const [subCatData, setSubCatData] = useState(null);
  const [catData, setCatData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchMainText, setSearchMainText] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredMainCategories, setFilteredMainCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleMainCatEdit = (product) => {
    setCatData(product);
    setOpenMainCat(true);
  };

  console.log(catData, "catData catDatacatData");

  useEffect(() => {
    const fetchData = async () => {
      if (!allCategory) await dispatch(fetchCategory()).unwrap();
      if (!allSubCategory) await dispatch(fetchSubCategory()).unwrap();
    };
    fetchData();
  }, [dispatch]);

  // Update filterId when category is selected
  useEffect(() => {
    const foundCategory = allCategory?.find(
      (category) => category.name === selectedCategory
    );
    setFilterId(foundCategory ? foundCategory.id : "");
  }, [selectedCategory, allCategory]);

  useEffect(() => {
    if (!allSubCategory) return; // Ensure data is available before filtering

    const filtered = allSubCategory
      .filter((subcategory) => !filterId || subcategory.category === filterId)
      .filter(
        (subcategory) =>
          !searchText ||
          subcategory.name.toLowerCase().includes(searchText.toLowerCase())
      );

    setFilteredSubCategories(filtered);
  }, [allSubCategory, filterId, searchText]);
  useEffect(() => {
    if (!allCategory) return;
    const filtered = allCategory.filter(
      (category) =>
        !searchMainText ||
        category.name.toLowerCase().includes(searchMainText.toLowerCase())
    );

    setFilteredMainCategories(filtered);
  }, [allCategory, searchMainText]);

  const subCategoryDelete = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteSubCategory(deleteConfirm)).unwrap();
      await dispatch(fetchSubCategory()).unwrap();
      setDeleteConfirm("");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const mainCategoryDelete = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteMainCategory(deleteConfirm)).unwrap();
      await dispatch(fetchCategory()).unwrap();
      setDeleteConfirm("");
    } catch (error) {
      console.error("Error deleting maincategory:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="py-5 px-10 min-h-screen font-poppins">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-5">
          <h1 className="text-2xl font-bold">Categories</h1>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-8">
            <select
              className="border rounded-lg px-5 py-2 focus:outline-none text-gray-700"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Products</option>
              {allCategory?.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setOpenMainCat(true)}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <FaPlusCircle className="w-5 h-5 mr-2" /> Add Main Category
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setIsOpen(true);
            setSubCatData(null);
          }}
          className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlusCircle className="w-5 h-5 mr-2" /> Add Sub-Category
        </button>
      </div>

      {/* Render Filtered Subcategories */}
      <div className="w-full flex items-start gap-5">
        <div className=" w-[70%] p-2">
          <div className="flex items-center gap-5">
            <div className="border px-4 rounded-md py-1 text-white bg-primary w-fit">
              <p>All sub-Category</p>
            </div>
            <div className="relative flex items-center w-96">
              <CiSearch size={20} className="absolute left-4 text-primary" />
              <input
                type="text"
                placeholder="Search by name"
                className="w-full pl-10 pr-4 py-1.5 text-sm font-inter font-normal border border-gray-300 rounded-full focus:border-primary focus:outline-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 mt-4">
            {filteredSubCategories?.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                setDeleteConfirm={setDeleteConfirm}
                toggleView={toggleView}
                setSubCatData={setSubCatData}
                setIsOpen={setIsOpen}
                setDeleteType={setDeleteType}
                setViewData={setViewData}
              />
            ))}
          </div>
        </div>
        <div className="w-[30%] border border-primary p-4 rounded-md ">
          <div className="space-y-3">
            <div className="border px-4 rounded-md py-1 text-white bg-red-600">
              <p>All Main Category</p>
            </div>
            <div className="relative flex items-center w-full">
              <CiSearch size={20} className="absolute left-4 text-red-600" />
              <input
                type="text"
                placeholder="Search by name"
                className="w-full pl-10 pr-4 py-1.5 text-sm font-inter font-normal border border-gray-300 rounded-full focus:border-red-600 focus:outline-none"
                value={searchMainText}
                onChange={(e) => setSearchMainText(e.target.value)}
              />
            </div>
            {filteredMainCategories?.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg shadow-sm border"
              >
                <div className="flex flex-col items-center gap-1 ">
                  <span className="text-sm font-medium">{product.name}</span>
                  <span className="text-sm font-medium">
                    {product.pathName}
                  </span>
                </div>
                <div className="flex items-center gap-5 ">
                  <button
                    onClick={() => handleMainCatEdit(product)}
                    className="bg-gray-200 p-2 text-primary rounded-lg"
                  >
                    <CiEdit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirm(product?.id);
                      setDeleteType("main");
                    }}
                    className="p-2 bg-red-200 text-red-800 rounded-lg"
                  >
                    <MdDeleteOutline size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <AddCategoryModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          subCatData={subCatData}
        />
      )}
      {openMainCat && (
        <AddMainCategoryModal
          isOpen={openMainCat}
          setIsOpen={setOpenMainCat}
          catData={catData}
          setCatData={setCatData}
        />
      )}
      {deleteConfirm && (
        <DeleteConfirmModal
          deleteConfirm={deleteConfirm}
          setDeleteConfirm={setDeleteConfirm}
          handleDeleteCategory={
            deleteType === "main" ? mainCategoryDelete : subCategoryDelete
          }
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
