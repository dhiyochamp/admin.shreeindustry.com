"use client";

import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import PaginationComponent from "@/components/common/PaginationComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMultipleWebStories,
  fetchWebStories,
  fetchWebStoriesByid,
} from "@/redux/dataSlice";
import Image from "next/image";
import BlogDetailModal from "../blog/BlogDetailModal";

const WebStorieTable = ({
  selectedIds,
  setSelectedIds,
  selectAll,
  setSelectAll,
  setIsOpen,
  setwebStoriesData,
}) => {
  const dispatch = useDispatch();
  const { allWebStories, allSubCategory, searchText, webStories } = useSelector(
    (state) => state.data
  );

  const [itemPerPage, setItemPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteMultipleWebStories([id])).unwrap();
      await dispatch(fetchWebStories({ search: "" })).unwrap();
    } catch (error) {
      console.error("Failed to delete blogs:", error);
    }
  };
  const tableHeadings = [
    "Image",
    "Heading",
    "Description",
    "Category",
    "Actions",
  ];

  const getSubCategoryNameById = (id) =>
    allSubCategory?.find((item) => item?.id === id)?.name || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(
          fetchWebStories({
            // id: null, // or your specific category id
            search: searchText,
            page: currentPage,
            itemPerPage,
          })
        ).unwrap();

        if (result?.count) {
          setTotalPages(Math.ceil(result.count / itemPerPage));
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, [searchText, currentPage, itemPerPage]);

  const fetchDataById = async (id, type) => {
    try {
      const result = await dispatch(fetchWebStoriesByid(id)).unwrap(); // this will be the current blog data

      if (type === "blog") {
        setIsModalOpen(true);
      }

      if (type === "edit") {
        setwebStoriesData(result);
        setIsOpen(true);
      }
    } catch (error) {
      console.log("error while fetching the data", error);
    }
  };

  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const allIds = allWebStories?.data?.map((item) => item?.id);
      setSelectedIds(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  return (
    <>
      <div className="relative font-inter max-w-full h-[65vh]">
        <div className="overflow-y-auto h-full custom-scrollbar border border-gray-300">
          <table className="min-w-full border-collapse text-left text-sm text-gray-500">
            <thead className="bg-[#ECF5FA] text-black text-nowrap sticky top-0 z-10 ">
              <tr>
                <th className="px-8 py-4">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 focus:outline-none focus:border-black"
                  />
                </th>
                {tableHeadings.map((heading, index) => (
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
              {allWebStories?.data?.map((item, index) => (
                <tr
                  key={item?.id || index}
                  className="hover:bg-gray-50 text-textColor text-sm border-b text-nowrap"
                >
                  <td className="px-8 py-4 font-medium text-black text-sm">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item?.id)}
                      onChange={() => handleCheckboxChange(item?.id)}
                      className="w-4 h-4 focus:outline-none focus:border-black"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-black text-sm">
                    <Image
                      src={item?.image}
                      alt="image"
                      height={100}
                      width={100}
                      priority
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-black text-sm">
                    {truncateText(item?.heading, 10)}
                  </td>
                  <td className="px-6 py-4 font-medium text-black text-sm">
                    {truncateText(item?.description, 10)}
                  </td>
                  <td className="px-6 py-4 font-medium text-black text-sm">
                    {getSubCategoryNameById(item?.category)}
                  </td>

                  <td className="px-6 py-4 flex items-center gap-4">
                    <button
                      onClick={() => fetchDataById(item?.id, "blog")}
                      className="py-1 px-1 bg-gray-100 rounded-md "
                    >
                      <IoEyeOutline size={18} />
                    </button>
                    <button
                      onClick={() => fetchDataById(item?.id, "edit")}
                      className="px-1 py-1 bg-gray-100 rounded-md "
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item?.id)}
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
            setItemPerPage={setItemPerPage}
          />
        </div>
      </div>
      <BlogDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        blog={selectedBlog}
      />
    </>
  );
};

export default WebStorieTable;
