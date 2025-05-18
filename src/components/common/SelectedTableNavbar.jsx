"use client";

import React from "react";
import { CiSearch, CiFilter, CiEdit } from "react-icons/ci";
import { FiUserPlus } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

export default function SelectedTableNavbar({
  setIsModalOpen,
  selectedIds,
  setSearchTerm,
  searchTerm,
  setIsEditOpen,
}) {
  return (
    <div className="w-full h-fit p-5 font-inter rounded-lg shadow-md">
      <div className="flex justify-between items-center w-full">
        {/* Search Bar */}
        <div className="relative flex items-center w-[60%]">
          <CiSearch size={20} className="absolute left-4 text-primary" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-full focus:border-primary focus:outline-none placeholder:text-gray-800"
          />
        </div>

        {/* Buttons Container */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsEditOpen(true)}
            className="bg-primary py-2 px-4 rounded-full flex items-center gap-2 hover:bg-blue-500 transition"
          >
            <CiEdit size={18} className="text-white" />
            <span className="text-sm font-medium text-white ">Edit</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 py-2 px-5 rounded-full bg-red-600 hover:bg-red-700 transition"
            >
              <MdDeleteOutline className="text-white" />
              <span className="font-medium text-sm text-white">
                Delete {selectedIds?.length} item
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
