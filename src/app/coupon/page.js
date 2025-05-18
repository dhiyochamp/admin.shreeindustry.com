"use client";
import TabelNavbar from "@/components/common/TabelNavbar";
import FullScreenLoader from "@/container/common/FullScreenLoader";
import CouponTable from "@/container/coupon/CouponTable";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const TypesofSort = [
    {
      name: "Sort by Inventory",
      option: ["Ascending ", "Descending ", "out of stock"],
    },

    {
      name: "Category",
      option: ["cat1", "cat2", "cat3", "cat4"],
    },
    {
      name: "sub-category",
      option: ["sub1", "sub2", "sub3"],
    },
  ];
  return (
    <>
      {!user?.email ? (
        <FullScreenLoader />
      ) : (
        <div className="w-full h-full overflow-y-auto no-scrollbar px-[1%] pt-[13vh]">
          <div className="">
            <TabelNavbar
              type="Create Coupon"
              TypesofSort={TypesofSort}
              isModalOpen={isModalOpen}
              isOpen={() => setIsModalOpen(true)}
              onClose={() => setIsModalOpen(false)}
            />
            <CouponTable />
          </div>
        </div>
      )}
    </>
  );
}
