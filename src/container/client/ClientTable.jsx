"use client";

import PaginationComponent from "@/components/common/PaginationComponent";
import Image from "next/image";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { MdIndeterminateCheckBox } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const ClientTable = ({ isView }) => {
  const tableHeadings = [
    "Customer ID",
    "Customer",
    "Phone No",
    "Address",
    "Action",
  ];
  const tableData = Array(10).fill({
    client: {
      customerId: "CS1343",
      image: "/assets/profile.png",
      name: "John Doe",
      email: "johndoe@gmail.com",
    },
    phoneNo: "123-456-7890",
    address: "123 Main Street",
  });
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
                  {booking.client?.customerId}
                </td>
                <td className="px-2 py-2 flex  gap-2">
                  <Image
                    src={booking?.client?.image}
                    alt={booking.client.name}
                    height={50}
                    width={50}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-black">{booking.client.name}</p>
                    <p className="">{booking.client.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <p className="pb-1"> {booking.phoneNo} </p>
                </td>
                <td className="px-6 py-4">{booking.address}</td>

                <td className="px-6 py-4 flex items-center gap-4">
                  <button
                    onClick={isView}
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
    </div>
  );
};

export default ClientTable;
