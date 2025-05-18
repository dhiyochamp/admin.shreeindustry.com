"use client";
import { addSEO, fetchSeo, updateSeo } from "@/redux/couponSlice";
import {
  fetchCategory,
  fetchProduct,
  fetchSubCategory,
} from "@/redux/dataSlice";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AddSeo({ pageUrl, onClose, EditData, setEditData }) {
  const dispatch = useDispatch();
  const { allCategory, allSubCategory, seoProduct } = useSelector(
    (state) => state.data
  );
  const dropdownRef = useRef(null);
  const subCategoryDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [seoData, setSeoData] = useState({
    pageUrl: "",
    relation_id: "",
    name: "",
    title: "",
    meta_description: "",
    keywords: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (EditData) {
      setSeoData({
        pageUrl: EditData.pageUrl || "",
        relation_id: EditData.relation_id || "",
        name: EditData.name || "",
        title: EditData.title || "",
        meta_description: EditData.meta_description || "",
        keywords: EditData.keywords || "",
      });

      // Determine the selected type (Category, SubCategory, or Product)
      if (allCategory?.some((cat) => cat.id === EditData.relation_id)) {
        setSelectedType("category");
      } else if (
        allSubCategory?.some((subCat) => subCat.id === EditData.relation_id)
      ) {
        setSelectedType("subcategory");
      } else if (
        seoProduct?.data?.some((prod) => prod.id === EditData.relation_id)
      ) {
        setSelectedType("product");
      }
    }
  }, [EditData, allCategory, allSubCategory, seoProduct]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchCategory()).unwrap();
      await dispatch(fetchSubCategory()).unwrap();
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchProduct({ searchTerm: searchText })).unwrap();
    };
    fetchData();
  }, [searchText]);

  const handleChange = (e) => {
    setSeoData({ ...seoData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setEditData(null);
    onClose();
  };

  const handleSelection = (type, value) => {
    setSelectedType(type);
    setSeoData((prevSeoData) => ({
      ...prevSeoData,
      pageUrl: value?.pathName, // Updating pageUrl
      relation_id: value?.id, // Updating relation_id
      name: value?.name || value?.productName, // Updating name
    }));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        subCategoryDropdownRef.current &&
        !subCategoryDropdownRef.current.contains(event.target)
      ) {
        setIsSubCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(seoData, "data is seo");
    try {
      setIsLoading(true);
      if (EditData?.id) {
        await dispatch(updateSeo({ seoData, id: EditData?.id })).unwrap();
        await dispatch(fetchSeo()).unwrap();
      } else {
        await dispatch(addSEO(seoData)).unwrap();
        await dispatch(fetchSeo()).unwrap();
      }
      handleCancel();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={handleCancel}
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {EditData ? "Update SEO Metadata" : "Add SEO Metadata"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative" ref={categoryDropdownRef}>
            <div
              className="w-full p-2 border rounded-md bg-white cursor-pointer"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              {selectedType === "category" ? seoData.name : "Select Category"}
            </div>
            {isCategoryOpen && (
              <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-md max-h-40 overflow-auto">
                {allCategory?.map((category) => (
                  <li
                    key={category.id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      handleSelection("category", category);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sub-Category Dropdown */}
          <div className="relative" ref={subCategoryDropdownRef}>
            <div
              className="w-full p-2 border rounded-md bg-white cursor-pointer"
              onClick={() => setIsSubCategoryOpen(!isSubCategoryOpen)}
            >
              {selectedType === "subcategory"
                ? seoData.name
                : "Select Sub-Category"}
            </div>
            {isSubCategoryOpen && (
              <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-md max-h-40 overflow-auto">
                {allSubCategory?.map((subCategory) => (
                  <li
                    key={subCategory.id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      handleSelection("subcategory", subCategory);
                      setIsSubCategoryOpen(false);
                    }}
                  >
                    {subCategory.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Product
            </label>
            <div className="relative w-full" ref={dropdownRef}>
              {/* Selected Product Box */}
              <div
                className="w-full p-2 border rounded-md bg-white cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {selectedType === "product"
                  ? seoData.name || "Select Product"
                  : "Select Product"}
              </div>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-md">
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search product..."
                    className="w-full p-2 border-b outline-none"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    autoFocus
                  />

                  {/* Product List */}
                  <ul className="max-h-40 overflow-auto">
                    {seoProduct?.data?.length > 0 ? (
                      seoProduct?.data?.map((product) => (
                        <li
                          key={product.id}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            handleSelection("product", product);
                            setIsOpen(false);
                          }}
                        >
                          {product.productName}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">No products found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* SEO Input Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={seoData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              name="meta_description"
              value={seoData.meta_description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              name="keywords"
              value={seoData.keywords}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              {isLoading
                ? "Loading..."
                : EditData
                ? "Update Metadata"
                : "Save Metadata"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
