"use client";

import DeleteModal from "@/components/modals/DeleteModal";
import AddSeo from "@/container/seo/AddSeo";
import SeoNavbar from "@/container/seo/SeoNavbar";
import SeoTable from "@/container/seo/SeoTable";
import ViewSeo from "@/container/seo/ViewSeo";
import { deleteSeo } from "@/redux/couponSlice";
import React, { useState } from "react";
import { FaKaaba } from "react-icons/fa";
import { useDispatch } from "react-redux";

export default function page() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seoData, setSeoData] = useState(null);
  const [isView, setIsView] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleDelete = async () => {
    if (selectedIds?.length === 0) {
      toast.warn("No items selected for deletion");
      return;
    }
    try {
      setIsLoading(true);
      await dispatch(deleteSeo(selectedIds)).unwrap();
      setSelectedIds([]);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[13vh] h-full px-[1%] overflow-y-auto custom-scrollbar">
      <div>
        <SeoNavbar
          setIsModalOpen={setIsModalOpen}
          selectedIds={selectedIds}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <div className="py-3 px-2">
          <SeoTable
            setIsModalOpen={setIsModalOpen}
            setSeoData={setSeoData}
            setIsView={setIsView}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            searchValue={searchValue}
          />
          {isModalOpen && (
            <AddSeo
              onClose={() => setIsModalOpen(false)}
              EditData={seoData}
              setEditData={setSeoData}
            />
          )}
          {isView && (
            <ViewSeo seoData={seoData} onClose={() => setIsView(false)} />
          )}
          <DeleteModal
            isModalOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            handleDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
