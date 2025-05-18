"use client";
import TabelNavbar from "@/components/common/TabelNavbar";
import FullScreenLoader from "@/container/common/FullScreenLoader";
import AddProduct from "@/container/product/AddProduct";
import ProductTable from "@/container/product/ProductTable";
import useDebounce from "@/lib/helperFunctions/useDebounce";
import {
  fetchAllProduct,
  fetchCategory,
  fetchSubCategory,
} from "@/redux/dataSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const dispatch = useDispatch();

  const { allSubCategory, allCategory, allProduct } = useSelector(
    (state) => state.data
  );
  const { user } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]); // Store category IDs
  const [selectedSubCategories, setSelectedSubCategories] = useState([]); // Store sub-category IDs
  const [selectedSort, setSelectedSort] = useState(""); // Store sort op
  const [selectedIds, setSelectedIds] = useState([]);

  const [dataLength, setDataLength] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(2);
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const debouncedSearch = useDebounce(searchTerm, 100); // Debounced value

  // const dataperPage = itemPerPage * currentPage;

  const totalPages = Math.ceil(allProduct?.total / itemPerPage);
  const currentData = allProduct?.data?.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

  useEffect(() => {
    const fetchCategories = async () => {
      await dispatch(fetchCategory()).unwrap();
      await dispatch(fetchSubCategory()).unwrap();
    };
    fetchCategories();
  }, [dispatch]);
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId) // Remove if already selected
          : [...prev, categoryId] // Add if not selected
    );
  };

  const handleSubCategoryChange = (subCategoryId) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };
  const handleSortChange = (sortName) => {
    setSelectedSort(sortName); // Store selected sorting option
  };

  // Apply Filter Function
  const applyFilters = () => {
    dispatch(
      fetchAllProduct({
        category: selectedCategories.length ? selectedCategories : undefined,
        subCategory: selectedSubCategories.length
          ? selectedSubCategories
          : undefined,
        sort: selectedSort || undefined, // Optional sorting
      })
    );
  };

  // Clean Filter Function
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedSort("");
  };

  const TypesofSort = [
    {
      name: "Sort by Inventory",
      option: [
        { name: "Ascending" },
        { name: "Descending " },
        { name: "out of stock" },
      ],
    },
    {
      name: "Category",
      option: allCategory,
    },
    {
      name: "sub-category",
      option: allSubCategory,
    },
  ];

  useEffect(() => {
    const currentLength = itemPerPage * currentPage * 2;
    if (dataLength >= itemPerPage * currentPage) {
      return;
    } else {
      setDataLength(currentLength);
    }

    // console.log(currentPage, totalPages, "afadfa");
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, itemPerPage]);

  useEffect(() => {
    const fetchProduct = async () => {
      await dispatch(
        fetchAllProduct({
          selectedCategories,
          selectedSubCategories,
          selectedSort,
          searchTerm: debouncedSearch, // Send debounced search term
          dataLength,
        })
      ).unwrap();
    };

    fetchProduct();
  }, [
    selectedCategories,
    selectedSubCategories,
    selectedSort,
    debouncedSearch,
    dataLength,
  ]);

  return (
    <>
      {!user?.email ? (
        <FullScreenLoader />
      ) : (
        <div className="w-full h-full overflow-y-auto no-scrollbar px-[1%] pt-[13vh]">
          {isOpen ? (
            <AddProduct onClose={() => setIsOpen(false)} />
          ) : (
            <div>
              {selectedIds.length === 0 && (
                <div className={`${isEdit ? "hidden" : ""}`}>
                  <TabelNavbar
                    type="product"
                    isOpen={() => setIsOpen(true)}
                    onClose={() => setIsOpen(false)}
                    TypesofSort={TypesofSort}
                    handleCategoryChange={handleCategoryChange}
                    clearFilters={clearFilters}
                    applyFilters={applyFilters}
                    handleSubCategoryChange={handleSubCategoryChange}
                    handleSortChange={handleSortChange}
                    selectedCategories={selectedCategories}
                    selectedSubCategories={selectedSubCategories}
                    selectedSort={selectedSort}
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                  />
                </div>
              )}
              <ProductTable
                setIsEdit={setIsEdit}
                isEdit={isEdit}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPages}
                itemPerPage={itemPerPage}
                setItemPerPage={setItemPerPage}
                setSelectedIds={setSelectedIds}
                selectedIds={selectedIds}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                currentData={currentData}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
