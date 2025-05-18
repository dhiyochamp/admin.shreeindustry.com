"use client";

import { setSearchText } from "@/redux/dataSlice";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { IoAddSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export default function BlogNavbar({
  setIsOpen,
  selectedIds,
  handleDelete,
  isLoading,
}) {
  const dispatch = useDispatch();
  const { searchText } = useSelector((state) => state.data);
  // Dummy toggle to simulate "Delete mode" UI (you can switch manually)
  const handleInputChange = (e) => {
    dispatch(setSearchText(e.target.value));
  };
  return (
    <div className="w-full h-fit font-inter">
      <div className="w-full h-full px-5 space-y-2 py-2 border-b">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-5 w-[60%]">
            {/* Search Input Box */}
            <div className="relative flex items-center w-[80%]">
              <CiSearch size={20} className="absolute left-4 text-primary" />
              <input
                type="text"
                placeholder="Search by heading"
                onChange={handleInputChange}
                value={searchText}
                className="w-full pl-12 pr-4 py-2 text-sm font-inter bg-[#F9F9F9] font-normal border border-gray-300 rounded-full focus:border-tertiary focus:outline-none placeholder:text-[#060606]"
              />
            </div>
          </div>

          {/* Right-side Button */}
          {selectedIds?.length > 0 ? (
            <div className="font-inter flex items-center gap-8 px-2 text-nowrap">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded-full text-white font-medium flex items-center gap-1"
              >
                <MdDeleteOutline size={20} />
                {isLoading ? "loading.." : `Delete ${selectedIds?.length} item`}
              </button>
            </div>
          ) : (
            <div className="font-inter flex items-center gap-8 px-2 text-nowrap">
              <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-primary rounded-full text-white font-medium flex items-center gap-1"
              >
                <IoAddSharp size={20} />
                Add Blog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
