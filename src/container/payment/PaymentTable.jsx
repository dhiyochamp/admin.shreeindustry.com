"use client";

import PaginationComponent from "@/components/common/PaginationComponent";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import OrderDetailsModal from "../calendar/OrderDetailsModal";

const PaymentTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableData = Array.from({ length: 10 }, (_, index) => ({
    paymentId: `PAY${1343 + index}`,
    orderId: `ORD${1343 + index}`,
    date: `2025-02-${String(10 + index).padStart(2, "0")}`,
    customerId: "OS1343",
    amount: `$${(100 + index * 10).toFixed(2)}`,
    paymentStatus: index % 2 === 0 ? "Paid" : "Pending",
  }));

  const tableHeadings = [
    "Payment ID",
    "Date",
    "Customer ID",
    "Order ID",
    "Amount",
    "Payment Status",
    "Actions",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData?.length / itemsPerPage);
  const currentData = tableData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative font-inter max-w-full h-[65vh]">
      {/* Scrollable Table Container */}
      <div className="overflow-y-auto h-full custom-scrollbar border border-gray-300">
        <table className="min-w-full border-collapse text-left text-sm text-gray-500">
          {/* Fixed Header */}
          <thead className="bg-[#ECF5FA] text-black text-nowrap sticky top-0 z-10 ">
            <tr>
              <th className="px-8 py-4">
                <input
                  type="checkbox"
                  className="w-4 h-4  focus:outline-none  focus:border-black"
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
          {/* Table Body */}
          <tbody className="font-medium font-poppins">
            {currentData?.map((booking, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 text-textColor text-sm border-b text-nowrap"
              >
                <td className="px-8 py-4 font-medium text-black text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4  focus:outline-none  focus:border-black"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-black text-sm">
                  {booking?.paymentId}
                </td>

                <td className="px-2 py-2 flex gap-2">{booking?.date} </td>
                <td className="px-6 py-4 text-sm">
                  <p className="pb-1"> {booking.customerId} </p>
                </td>
                <td className="px-6 py-4"> {booking.orderId}</td>
                <td className="px-6 py-4">{booking.amount}</td>

                <td className="px-6 py-4">
                  <p className="font-medium pb-1">{booking.paymentStatus}</p>
                </td>
                <td className="px-6 py-4 flex items-center gap-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="py-1 px-1 bg-gray-100 rounded-md "
                  >
                    <IoEyeOutline size={18} />
                  </button>
                  <button className="px-1 py-1 bg-gray-100 rounded-md ">
                    <FiEdit size={18} />
                  </button>
                  <button className="px-1 py-1 bg-gray-100 rounded-md ">
                    <RiDeleteBin6Line size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixed Pagination Below Table */}
      <div className="w-full bg-white sticky bottom-0 py-2 shadow-md">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PaymentTable;
