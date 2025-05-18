"use client";

import { deleteProducts, fetchProductsBySubCategory } from "@/redux/dataSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoChevronBackSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import AddProduct from "../product/AddProduct";
import DeleteModal from "@/components/modals/DeleteModal";

export default function EditCategoryPage({ toggleView, viewData }) {
  const { allCategory, allProductCategory } = useSelector(
    (state) => state.data
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const matchedCategory =
    allCategory.find((category) => category.id === viewData?.category) || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(
          fetchProductsBySubCategory({ subCategoryId: viewData?.id })
        ).unwrap();
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchData();
  }, [dispatch]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteProducts(selectedIds)).unwrap();
      await dispatch(
        fetchProductsBySubCategory({ subCategoryId: viewData?.id })
      ).unwrap();
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
      {!isOpen && (
        <div className="py-5 px-10 min-h-screen font-poppins">
          <div className="flex items-center gap-10 pb-5">
            <div
              onClick={toggleView}
              className="flex items-center text-black cursor-pointer"
            >
              <IoChevronBackSharp />
              Back
            </div>
            <h1>{viewData?.name}</h1>
          </div>
          <div className="max-w-full flex gap-6">
            {/* Products Section */}
            <div className="w-2/3 p-6 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Products
                <span className="px-5 text-black">
                  {allProductCategory?.total}
                </span>
              </h2>
              <div className="space-y-3">
                {allProductCategory?.data?.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm border"
                  >
                    <div className="flex items-center gap-3 ">
                      <Image
                        src={product.images.top}
                        alt={product.productName}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <span className="text-sm font-medium">
                        {product.productName}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 ">
                      <button
                        onClick={() => {
                          setIsEdit(product);
                          setIsOpen(true);
                        }}
                        className="bg-gray-200 p-2 text-primary rounded-lg"
                      >
                        <CiEdit size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setSelectedIds([product?.id]);
                        }}
                        className="p-2 bg-red-200 text-red-800 rounded-lg"
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="mt-4 w-full text-blue-600 border border-blue-600 py-2 rounded-lg"
              >
                + Add Product
              </button>
            </div>

            {/* Category Info Section */}
            <div className="w-1/3 p-6 bg-white rounded-lg shadow space-y-6">
              {/* Category Visibility */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold mb-2">Category </h3>
                <div className="font-poppins text-textColor flex items-start justify-between mb-4">
                  <p className="text-sm font-bold">Main Category</p>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">
                      {matchedCategory?.name}
                    </p>
                    <p className="text-sm font-semibold">
                      {matchedCategory?.pathName}
                    </p>
                  </div>
                </div>
                <div className="font-poppins text-textColor flex items-center justify-between ">
                  <p className="text-sm font-bold">Sub Category</p>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">{viewData?.name}</p>
                    <p className="text-sm font-semibold">
                      {viewData?.pathName}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="mt-4 w-full text-blue-600 border border-blue-600 py-2 rounded-lg"
              >
                + Add Product
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpen && (
        <AddProduct
          onClose={() => setIsOpen(false)}
          data={isEdit}
          setIsEdit={setIsEdit}
          cat={viewData?.category}
          sub={viewData?.id}
        />
      )}
      <DeleteModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleDelete={handleDelete}
        isLoading={isLoading}
      />
    </>
  );
}
