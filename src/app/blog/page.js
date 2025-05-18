"use client";

import DeleteModal from "@/components/modals/DeleteModal";
import AddBlog from "@/container/blog/AddBlog";
import BlogNavbar from "@/container/blog/BlogNavbar";
import BlogTable from "@/container/blog/BlogTable";
import { deleteMultipleBlogs, fetchBlogs } from "@/redux/dataSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function page() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteMultipleBlogs(selectedIds)).unwrap();
      await dispatch(fetchBlogs({ search: "" })).unwrap();
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to delete blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[13vh] h-full px-[1%] overflow-y-auto custom-scrollbar">
      <div>
        <BlogNavbar
          setIsOpen={setIsOpen}
          selectedIds={selectedIds}
          isLoading={isLoading}
          handleDelete={handleDelete}
          // searchText={searchText}
          // setSearchText={setSearchText}
        />
        <div className="py-3 px-2">
          <BlogTable
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            setIsOpen={setIsOpen}
            setBlogData={setBlogData}
            // searchText={searchText}
            // setSearchText={setSearchText}
          />

          <AddBlog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            blogData={blogData}
            setBlogData={setBlogData}
          />
          {/* <DeleteModal
            isModalOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            handleDelete={handleDelete}
            isLoading={isLoading}
          /> */}
        </div>
      </div>
    </div>
  );
}
