"use client";

import PaginationComponent from "@/components/common/PaginationComponent";
import {
  deleteProducts,
  fetchCategory,
  fetchSubCategory,
} from "@/redux/dataSlice";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import AddProduct from "./AddProduct";
import DeleteModal from "@/components/modals/DeleteModal";
import SelectedTableNavbar from "@/components/common/SelectedTableNavbar";
import EditEvent from "@/components/modals/EditEvent";
import ProductPreview from "./ProductPreview";

const ProductTable = ({
  setIsEdit,
  isEdit,
  setCurrentPage,
  currentPage,
  totalPages,
  setItemPerPage,
  itemPerPage,
  selectedIds,
  setSelectedIds,
  setSearchTerm,
  searchTerm,
  currentData,
}) => {
  const dispatch = useDispatch();
  const { allProduct, allSubCategory, allCategory } = useSelector(
    (state) => state.data
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const tableHeadings = [
    // "Product ID",
    "Product",
    "Inventory",
    "Category",
    "Price",
    "Product Type",
    "Actions",
  ];

  const findNameById = (data, id) => {
    if (!Array.isArray(data)) {
      console.error("Expected an array but got:", data);
      return "Invalid data";
    }
    const item = data.find((obj) => obj.id === id);
    return item ? item.name : "Not found";
  };

  useEffect(() => {
    const fetchProduct = async () => {
      await dispatch(fetchCategory()).unwrap();
      await dispatch(fetchSubCategory()).unwrap();
    };
    fetchProduct();
  }, [dispatch, currentPage]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allProduct?.data?.map((product) => product.id) || []);
    }
    setSelectAll(!selectAll);
  };
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteProducts(selectedIds)).unwrap();
      setSelectedIds([]); // Clear selection after successful deletion
    } catch (error) {
      console.error("Failed to delete products:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {selectedIds.length > 0 && (
        <SelectedTableNavbar
          selectedIds={selectedIds}
          setIsModalOpen={setIsModalOpen}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          setIsEditOpen={setIsEditOpen}
        />
      )}

      {isEditOpen && (
        <EditEvent
          isModalOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          setSelectedIds={setSelectedIds}
          selectedIds={selectedIds}
        />
      )}
      {!isEdit && (
        <div className="relative font-inter max-w-full h-[65vh]">
          <div className="overflow-y-auto h-full custom-scrollbar border border-gray-300">
            <table className="min-w-full border-collapse text-left text-sm text-gray-500">
              <thead className="bg-[#ECF5FA] text-black text-nowrap sticky top-0 z-10 ">
                <tr>
                  <th className="px-8 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 focus:outline-none focus:border-black"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {tableHeadings?.map((heading, index) => (
                    <th
                      key={index}
                      className="px-6 py-4 font-medium text-sm text-black bg-[#ECF5FA]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-medium font-poppins">
                {currentData?.map((product, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 text-textColor text-sm border-b text-nowrap"
                  >
                    <td className="px-8 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 focus:outline-none focus:border-black"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleCheckboxChange(product.id)}
                      />
                    </td>

                    <td className="px-2 py-2 flex gap-2">
                      {product?.images?.top && (
                        <Image
                          src={product?.images?.top}
                          alt={product?.productName}
                          height={80}
                          width={80}
                        />
                      )}
                      <div className="flex flex-col gap-1">
                        <p className="text-black">
                          {findNameById(
                            allSubCategory || [],
                            product.subCategory
                          )}
                        </p>
                        <p>{product.productName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <p className="mb-1"> {product.inventory}</p>
                      {product?.outOfStock && (
                        <p className="bg-red-200 text-red-600 px-2 py-1 rounded-md text-xs">
                          out of stock
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {findNameById(allCategory || [], product.category)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium pb-1 text-xs line-through">
                        {product.productPricing?.price || 2000}
                      </p>
                      <p className="font-medium pb-1">
                        {product.productPricing?.discountPrice || 1000}
                      </p>
                    </td>
                    <td className="px-6 py-4">{product?.category_type}</td>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <button
                        onClick={() => {
                          setOpenPreview(true);
                          setPreviewData(product);
                        }}
                        className="py-1 px-1 bg-gray-100 rounded-md "
                      >
                        <IoEyeOutline size={18} />
                      </button>
                      <button
                        onClick={() => setIsEdit(product)}
                        className="px-1 py-1 bg-gray-100 rounded-md "
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setSelectedIds([product?.id]);
                        }}
                        className="px-1 py-1 bg-gray-100 rounded-md "
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setItemPerPage={setItemPerPage}
            itemPerPage={itemPerPage}
          />
        </div>
      )}
      {isEdit && <AddProduct data={isEdit} setIsEdit={setIsEdit} />}
      <DeleteModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleDelete={handleDelete}
        isLoading={isLoading}
      />
      <ProductPreview
        isOpen={openPreview}
        onClose={() => setOpenPreview(false)}
        product={previewData}
      />
    </>
  );
};

export default ProductTable;
