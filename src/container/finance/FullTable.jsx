"use client";

import BookingTable from "@/components/common/BookingTable";
import PaginationComponent from "@/components/common/PaginationComponent";
import ServiceBooking from "@/components/Sidebars/ServiceBooking";
import TabelNavbar from "@/components/common/TabelNavbar";
import React, { useState, useRef, useEffect } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { FiUserPlus } from "react-icons/fi";
import FinanceTable from "./FinanceTable";

export default function FullTable() {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // const [isVisible, setIsVisible] = useState(false);
  const totalPages = 20;
  const filterRef = useRef(null);

  const TypesofSort = [
    {
      name: "Booking ID",
    },
    {
      name: "Booking Date",
    },
    {
      name: "Date",
      option: ["Start Date", "End Date"],
    },
    {
      name: "Status",
      option: ["Completed", "Delayed", "At risk"],
    },
    {
      name: "Payment",
      option: ["Paid", "Pending"],
    },
  ];

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

  return (
    <section
      className={`w-full h-fit font-inter pb-5 transition-transform duration-1000 ease-in-out`}
    >
      <div className="bg-white border rounded-lg w-full ">
        <TabelNavbar
          type="FinanceTable"
          setSidebarOpen={setSidebarOpen}
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <FinanceTable />
        <PaginationComponent
          currentPage={currentPage}
          setcurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
      <ServiceBooking
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </section>
  );
}
