"use client";

import React, { useState, useRef, useEffect } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import dateFormat from "dateformat";
import { setSearchText } from "@/redux/dataSlice";
import { useDispatch, useSelector } from "react-redux";

export default function CalendarNavbar({
  isOpen,
  onClose,
  setSidebarOpen,
  type,
  heading,
  timeSlots,
  // handleNextDate,
  selectedDate,
  setselectedDate,
  TypesofSort,
}) {
  const dispatch = useDispatch();
  const { searchText } = useSelector((state) => state.data);

  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  const dateRef = useRef(null);
  const formatedDate = dateFormat(selectedDate, "mmmm dd");
  // function formatDateToYMD(date) {
  //   return date.toISOString().split("T")[0]; // returns 'YYYY-MM-DD'
  // }

  console.log(selectedDate, "selectedDateselectedDateselectedDate");

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

  // const Tabs = ["Monthly", "Weekly", "Daily"];
  // Dummy toggle to simulate "Delete mode" UI (you can switch manually)
  const handleInputChange = (e) => {
    dispatch(setSearchText(e.target.value));
  };

  return (
    <div className="w-full h-fit font-inter">
      <div className="w-full h-full px-5 space-y-2 py-2 border-b">
        <div className="flex justify-between items-center w-full ">
          <div className="flex items-center gap-5 w-[60%]">
            <div className="relative flex items-center w-[80%] ">
              <CiSearch size={20} className="absolute left-4 text-primary" />
              <input
                type="text"
                placeholder="Search..."
                onChange={handleInputChange}
                value={searchText}
                className="w-full pl-12 pr-4 py-2 text-sm font-inter bg-[#F9F9F9] font-normal border border-gray-300 rounded-full focus:border-tertiary focus:outline-none placeholder:text-[#060606]"
              />
            </div>
            <div className="flex items-center gap-8 ">
              {/* Filter Button and Filter Dropdown */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="flex items-center gap-2 py-2 px-5 rounded-full bg-[#F3F4F6] hover:bg-gray-200 border border-gray-400"
                >
                  <CiFilter />
                  <span className="font-medium text-sm text-textColor">
                    Filter
                  </span>
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 cursor-pointer shadow-sm bg-white border rounded-lg p-4 w-80 z-40">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex flex-col pl-4">
                        <p className="text-sm font-medium text-black border-b border-[#D9D9D9] py-1 w-full">
                          Date
                        </p>
                        <div className="flex items-center gap-4 py-3 ">
                          <div className="flex flex-col gap-1 text-sm ">
                            <label>Start date</label>
                            <input
                              type="date"
                              className="focus:outline-none  border border-gray-400 rounded-sm "
                            />
                          </div>
                          <div className="flex flex-col gap-1 text-sm ">
                            <label>Start date</label>
                            <input
                              type="date"
                              className="focus:outline-none border border-textColor rounded-md "
                            />
                          </div>
                        </div>
                      </div>
                      {TypesofSort.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-3 items-start w-full"
                        >
                          {/* Main Label */}
                          <div className="flex items-center w-full pl-4">
                            {item?.option ? (
                              <label
                                htmlFor={`filter-${index}`}
                                className="text-sm font-medium text-black border-b border-[#D9D9D9] py-1 w-full"
                              >
                                {item.name}
                              </label>
                            ) : (
                              <div className="flex items-center gap-4">
                                <input
                                  type="checkbox"
                                  className=" accent-primary focus:outline-none"
                                  id={`filter-${index}`}
                                />
                                <label
                                  htmlFor={`filter-${index}`}
                                  className="text-sm font-medium text-black"
                                >
                                  {item.name}
                                </label>
                              </div>
                            )}
                          </div>

                          {/* Options Rendering */}
                          {item?.option && (
                            <div className="flex items-center flex-wrap  w-full gap-5 pl-4">
                              {item.option.map((opt, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="checkbox"
                                    className=" accent-primary focus:outline-none"
                                    id={`filter-${index}-option-${optIndex}`}
                                  />
                                  <label
                                    htmlFor={`filter-${index}-option-${optIndex}`}
                                    className="text-sm font-medium text-gray-700"
                                  >
                                    {opt}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Remove Filters Button */}
                    <div className="flex items-center justify-between px-2 gap-5 mt-8 font-poppins">
                      <button className=" py-1.5 px-4  bg-primary text-white hover:bg-red-500 rounded text-sm">
                        Apply Filter
                      </button>
                      <button className=" py-1.5 px-4 bg-[#EAEAEA] text-primary  rounded text-sm">
                        Clean Filter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="font-inter flex items-center gap-8 px-2 text-nowrap">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-xl ">{formatedDate}</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setselectedDate(e.target.value)}
                className="appearance-none w-5 text-primary"
                ref={dateRef}
              />
            </div>
            {/* <div className="flex items-center gap-1">
              <button
                onClick={() => handleNextDate(false)}
                className="bg-red-100 py-1.5 px-1 rounded"
              >
                <IoIosArrowBack className="text-primary" />
              </button>
              <div className="text-center bg-primary text-white font-medium text-sm py-1 px-4 rounded">
                {formatedDate === dateFormat(new Date(), "mmmm dd")
                  ? "Today"
                  : formatedDate ===
                    dateFormat(
                      new Date().setDate(new Date().getDate() + 1),
                      "mmmm dd"
                    )
                  ? "Tommorow"
                  : formatedDate ===
                    dateFormat(
                      new Date().setDate(new Date().getDate() - 1),
                      "mmmm dd"
                    )
                  ? "Yesterday"
                  : formatedDate}
              </div>
              <button
                onClick={() => handleNextDate(true)}
                className="bg-red-100 py-1.5 px-1 rounded"
              >
                <IoIosArrowForward className="text-primary" />
              </button>
            </div> */}
            <button
              onClick={() => setselectedDate("")}
              className="bg-red-200 text-red-800 border border-red-800 px-4 py-1 font-semibold text-sm rounded"
            >
              Remove Date Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
