"use client";

import PaginationComponent from "@/components/common/PaginationComponent";
import { fetchSeo, deleteSeo } from "@/redux/couponSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

const SeoTable = ({
  setSeoData,
  setIsModalOpen,
  setIsView,
  selectedIds,
  setSelectedIds,
  setIsDeleteModalOpen,
  searchValue,
}) => {
  const dispatch = useDispatch();
  const { allSeo } = useSelector((state) => state.coupon);

  const tableHeadings = [
    "name",
    "pageUrl",
    "title",
    "meta_description",
    "keywords",
    "Actions",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allSeo?.length / itemsPerPage);
  const currentData = allSeo?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSeo(searchValue)).unwrap();
      } catch (error) {
        console.log(error, "error while fetching the data");
      }
    };
    fetchData();
  }, [dispatch, searchValue]);

  // Toggle individual checkbox
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle all checkboxes
  const handleSelectAll = () => {
    if (selectedIds?.length === currentData?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentData?.map((item) => item.id));
    }
  };
  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Handle delete selected

  return (
    <div className="relative font-inter max-w-full h-[65vh]">
      <div className="overflow-y-auto h-full custom-scrollbar border border-gray-300">
        <table className="min-w-full border-collapse text-left text-sm text-gray-500">
          <thead className="bg-[#ECF5FA] text-black text-nowrap sticky top-0 z-10 ">
            <tr>
              <th className="px-8 py-4">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === currentData?.length &&
                    currentData.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 focus:outline-none focus:border-black"
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
            {currentData?.map((booking, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 text-textColor text-sm border-b text-nowrap"
              >
                <td className="px-8 py-4 font-medium text-black text-sm">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(booking.id)}
                    onChange={() => handleCheckboxChange(booking.id)}
                    className="w-4 h-4 focus:outline-none focus:border-black"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-black text-sm">
                  {truncateText(booking?.name, 10 || "")}
                </td>
                <td className="px-6 py-4 font-medium text-black text-sm">
                  {truncateText(booking?.pageUrl, 10 || "")}
                </td>
                <td className="px-2 py-2 flex gap-2">
                  {booking?.title.split(" ").slice(0, 3).join(", ")}
                  {booking?.title.split(" ").length > 3 ? "..." : ""}{" "}
                </td>
                <td className="px-6 py-4 text-sm">
                  {booking.meta_description.split(" ").slice(0, 3).join(", ")}
                  {booking.meta_description.split(" ").length > 3 ? "..." : ""}
                </td>
                <td className="px-6 py-4">
                  {booking.keywords.split(",").slice(0, 3).join(", ")}
                  {booking.keywords.split(",").length > 3 ? "..." : ""}
                </td>
                <td className="px-6 py-4 flex items-center gap-4">
                  <button
                    onClick={() => {
                      setSeoData(booking);
                      setIsView(true);
                    }}
                    className="py-1 px-1 bg-gray-100 rounded-md "
                  >
                    <IoEyeOutline size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSeoData(booking);
                      setIsModalOpen(true);
                    }}
                    className="px-1 py-1 bg-gray-100 rounded-md "
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setSelectedIds([booking?.id]);
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
      <div className="w-full bg-white sticky bottom-0 py-2 shadow-md flex justify-between px-4">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default SeoTable;
