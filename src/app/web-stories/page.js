"use client";

import DeleteModal from "@/components/modals/DeleteModal";
import AddBlog from "@/container/blog/AddBlog";
import AddWebStorie from "@/container/webStorie/AddWebStorie";
import WebStorieNavbar from "@/container/webStorie/WebStorieNavbar";
import WebStorieTable from "@/container/webStorie/WebStorieTable";
import { deleteMultipleWebStories, fetchWebStories } from "@/redux/dataSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function page() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [webStoriesData, setwebStoriesData] = useState(null);
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteMultipleWebStories(selectedIds)).unwrap();
      await dispatch(fetchWebStories({ search: "" })).unwrap();
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
        <WebStorieNavbar
          setIsOpen={setIsOpen}
          selectedIds={selectedIds}
          isLoading={isLoading}
          handleDelete={handleDelete}
          // searchText={searchText}
          // setSearchText={setSearchText}
        />
        <div className="py-3 px-2">
          <WebStorieTable
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            setIsOpen={setIsOpen}
            setwebStoriesData={setwebStoriesData}
            // searchText={searchText}
            // setSearchText={setSearchText}
          />

          <AddWebStorie
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setwebStoriesData={setwebStoriesData}
            webStoriesData={webStoriesData}
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
