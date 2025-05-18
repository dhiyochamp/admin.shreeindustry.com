"use client";

import PaginationComponent from "@/components/common/PaginationComponent";
import TabelNavbar from "@/components/common/TabelNavbar";
import DeleteModal from "@/components/modals/DeleteModal";
import AddClient from "@/components/Sidebars/AddClient";
import ClientTable from "@/container/client/ClientTable";
import CustomerInfo from "@/container/client/CustomerInfo";
import React, { useState, useRef, useEffect } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { FiUserPlus } from "react-icons/fi";

export default function page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isView, setIsView] = useState(false);

  // const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section
      className={`w-full h-full font-inter pt-[13vh] px-[1%] pb-5 transition-transform duration-1000 ease-in-out overflow-auto custom-scrollbar`}
    >
      {isView ? (
        <CustomerInfo onClose={() => setIsView(false)} />
      ) : (
        <div className="bg-white border rounded-lg ">
          <TabelNavbar
            type="clientTable"
            isOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
          />
          <ClientTable isView={() => setIsView(true)} />
        </div>
      )}
    </section>
  );
}
