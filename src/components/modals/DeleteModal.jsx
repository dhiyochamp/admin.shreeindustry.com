import React from "react";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";

export default function DeleteModal({
  isModalOpen,
  onClose,
  handleDelete,
  isLoading,
}) {
  if (!isModalOpen) return null;

  return (
    <>
      <div
        className="fixed top-[13vh] inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      <div className=" font-nunito fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md w-[30%] z-50 py-8">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <IoClose size={24} />
        </button>

        <div className="flex justify-center">
          <RiDeleteBin6Fill size={50} className="text-red-600" />
        </div>

        <h2 className="text-xl font-extrabold font-nunito text-center text-gray-800 mt-5">
          Are You Sure?
        </h2>

        <p className="text-center font-semibold text-base  text-[#223142] mt-5 ">
          Are you certain you want to delete this record?
        </p>

        <div className="flex justify-center gap-10 mt-8">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className={`bg-red-600 text-white px-4 py-2 rounded-sm shadow hover:bg-red-700 text-sm font-semibold ${
              isLoading ? "opacity-30" : ""
            }`}
          >
            {isLoading ? "loading..." : "Yes, Delete It!"}
          </button>
          <button
            onClick={onClose}
            className="border border-[#223142] px-4 py-2 rounded-sm text-[#223142] shadow hover:bg-[#223142] text-sm font-semibold hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
