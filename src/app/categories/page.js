"use client";

import CategoryPage from "@/container/category/CategoryPage";
import EditCategoryPage from "@/container/category/EditCategoryPage";
import FullScreenLoader from "@/container/common/FullScreenLoader";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function page() {
  const [isView, setIsView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const toggleView = () => {
    setIsView(!isView);
    if (viewData) {
      setViewData(null);
    }
  };

  return (
    <>
      {!user?.email ? (
        <FullScreenLoader />
      ) : (
        <div className="w-full h-full overflow-y-auto no-scrollbar px-[1%] pt-[13vh]">
          {/* <Table /> */}
          {!isView ? (
            <CategoryPage toggleView={toggleView} setViewData={setViewData} />
          ) : (
            <EditCategoryPage toggleView={toggleView} viewData={viewData} />
          )}
        </div>
      )}
    </>
  );
}
