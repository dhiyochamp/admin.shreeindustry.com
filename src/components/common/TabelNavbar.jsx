"use client";

import React, { useState, useRef, useEffect } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { FiUserPlus } from "react-icons/fi";
import { LuLoader } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import CouponFormModal from "@/container/coupon/CouponFormModal";

export default function TabelNavbar({
  onClose,
  isOpen,
  isModalOpen,
  setIsModalOpen,
  setSidebarOpen,
  type,
  TypesofSort,
  handleCategoryChange,
  clearFilters,
  applyFilters,
  handleSubCategoryChange,
  handleSortChange,
  selectedSort,
  selectedSubCategories,
  selectedCategories,
  setSearchTerm,
  searchTerm,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [filterSet, setFilterSet] = useState(0);
  const filterRef = useRef(null);

  // const TypesofSort = [
  //   {
  //     name: "Booking ID",
  //   },
  //   {
  //     name: "Booking Date",
  //   },
  //   {
  //     name: "Date",
  //     option: ["Start Date", "End Date"],
  //   },
  //   {
  //     name: "Status",
  //     option: ["Completed", "Delayed", "At risk"],
  //   },
  //   {
  //     name: "Payment",
  //     option: ["Paid", "Pending"],
  //   },
  // ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterTabs = [
    {
      icon: CiFilter,
      text: "All Orders",
    },
    {
      icon: LuLoader,
      text: "Pending",
    },
    {
      icon: FiBox,
      text: "Delivered",
    },
    {
      icon: LuRefreshCw,
      text: "Returns",
    },
    {
      icon: FiBox,
      text: "Cancelled",
    },
  ];

  return (
    <>
      <div className="w-full h-fit font-inter">
        <div className="w-full h-full  p-5 space-y-6">
          <div className="flex justify-between items-center w-full">
            {/* Search Bar */}
            <div className="relative flex items-center w-[70%]">
              <CiSearch size={20} className="absolute left-4 text-primary" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 text-sm font-inter bg-[#F9F9F9] font-normal border border-gray-300 rounded-full focus:border-tertiary focus:outline-none placeholder:text-[#060606]"
              />
            </div>

            <div className="flex items-center gap-8 ">
              {/* Filter Button and Filter Dropdown */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`flex items-center gap-2 py-2 px-5 rounded-full bg-[#F3F4F6] hover:bg-gray-200 ${
                    type === "clientTable" ? "hidden" : ""
                  }`}
                >
                  <CiFilter />
                  <span className="font-medium text-sm text-textColor">
                    Filter
                  </span>
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 cursor-pointer shadow-sm bg-white border rounded-lg p-4 w-72 z-40">
                    <div className="flex flex-col w-full">
                      {TypesofSort?.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-3 items-start w-full"
                        >
                          {/* Main Label */}
                          {item.name === "Sort by Inventory" && (
                            <p className="text-sm font-semibold font-poppins">
                              Sort by Inventory
                            </p>
                          )}
                          <div className="flex items-center w-full flex-wrap gap-3 border-t py-1 ">
                            {item.name === "Sort by Inventory" &&
                              item?.option?.map((opt, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    checked={selectedSort === opt.name}
                                    onChange={() => handleSortChange(opt.name)}
                                  />
                                  <label className="text-sm font-medium text-gray-700 text-nowrap">
                                    {opt.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                          {/* Options Rendering */}
                          {item.name === "Category" && (
                            <p className="text-sm font-semibold font-poppins">
                              Category
                            </p>
                          )}
                          <div className="flex items-center w-full flex-wrap gap-3">
                            {item.name === "Category" &&
                              item?.option?.map((opt, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories?.includes(
                                      opt?.id
                                    )}
                                    onChange={() =>
                                      handleCategoryChange(opt.id)
                                    }
                                  />
                                  <label className="text-sm font-medium text-gray-700">
                                    {opt.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                          {item.name === "sub-category" && (
                            <p className="text-sm font-semibold font-poppins">
                              sub-category
                            </p>
                          )}
                          <div className="flex items-center w-full flex-wrap gap-3  ">
                            {item.name === "sub-category" &&
                              item.option.map((opt, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedSubCategories?.includes(
                                      opt.id
                                    )}
                                    onChange={() =>
                                      handleSubCategoryChange(opt?.id)
                                    }
                                  />
                                  <label className="text-sm font-medium text-gray-700">
                                    {opt.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Remove Filters Button */}
                    <div className="flex items-center justify-between px-2 gap-5 mt-8">
                      <button
                        onClick={applyFilters}
                        className="py-1.5 px-4 bg-primary text-white hover:bg-red-500 rounded text-sm"
                      >
                        Apply Filter
                      </button>
                      <button
                        onClick={clearFilters}
                        className="py-1.5 px-4 bg-[#EAEAEA] text-primary rounded text-sm"
                      >
                        Clean Filter
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* add Booking */}

              <div className="">
                <button
                  onClick={isOpen}
                  className={`bg-primary py-2 px-4 rounded-full flex items-center gap-2 hover:bg-red-500 ${
                    type === "clientTable" ? "hidden" : ""
                  }`}
                >
                  <FiUserPlus size={18} className="text-white" />
                  <span className="text-sm font-medium text-white">
                    {type === "Create Coupon"
                      ? "Create Coupon"
                      : " Add product"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          {type ? (
            ""
          ) : (
            <div className="flex items-center gap-8">
              {filterTabs?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setFilterSet(index)}
                  className={`flex items-center gap-2 hover:bg-[#0A0338] hover:text-white py-2 px-4 rounded-full group transition-all duration-200 ease-in-out ${
                    filterSet === index
                      ? "bg-[#0A0338] text-white"
                      : "text-textColor"
                  }`}
                >
                  <item.icon size={20} className="" />
                  <span className="text-sm font-medium">{item.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <CouponFormModal isModalOpen={isModalOpen} onClose={onClose} />
    </>
  );
}
