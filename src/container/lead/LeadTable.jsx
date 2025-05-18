// "use client";

// import React, { useState } from "react";
// import { FiEdit } from "react-icons/fi";
// import { IoEyeOutline } from "react-icons/io5";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import OrderDetailsModal from "../calendar/OrderDetailsModal";
// import PaginationComponent from "@/components/common/PaginationComponent";

// const LeadTable = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const tableData = Array.from({ length: 10 }, (_, index) => ({
//     orderId: `ORD${1343 + index}`,
//     date: `2025-02-${String(10 + index).padStart(2, "0")}`,
//     customerId: "OS1343",
//     amount: `$${(100 + index * 10).toFixed(2)}`,
//     paymentStatus: index % 2 === 0 ? "Paid" : "Pending",
//     orderStatus: index % 3 === 0 ? "Delivered" : "Processing",
//   }));

//   const tableHeadings = [
//     "Order ID",
//     "Date",
//     "Customer ID",
//     "Amount",
//     "Payment Status",
//     "Order Status",
//     "Actions",
//   ];

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const totalPages = Math.ceil(tableData?.length / itemsPerPage);
//   const currentData = tableData?.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="relative font-inter max-w-full h-[65vh]">
//       {/* Scrollable Table Container */}
//       <div className="overflow-y-auto h-full custom-scrollbar border border-gray-300">
//         <table className="min-w-full border-collapse text-left text-sm text-gray-500">
//           {/* Fixed Header */}
//           <thead className="bg-[#ECF5FA] text-black text-nowrap sticky top-0 z-10 ">
//             <tr>
//               <th className="px-8 py-4">
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4  focus:outline-none  focus:border-black"
//                 />
//               </th>
//               {tableHeadings?.map((heading, index) => (
//                 <th
//                   key={index}
//                   className="px-6 py-4 font-medium text-sm text-black bg-[#ECF5FA]"
//                 >
//                   {heading}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           {/* Table Body */}
//           <tbody className="font-medium font-poppins">
//             {currentData?.map((booking, index) => (
//               <tr
//                 key={index}
//                 className="hover:bg-gray-50 text-textColor text-sm border-b text-nowrap"
//               >
//                 <td className="px-8 py-4 font-medium text-black text-sm">
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4  focus:outline-none  focus:border-black"
//                   />
//                 </td>
//                 <td className="px-6 py-4 font-medium text-black text-sm">
//                   {booking?.orderId}
//                 </td>
//                 <td className="px-2 py-2 flex gap-2">{booking?.date} </td>
//                 <td className="px-6 py-4 text-sm">
//                   <p className="pb-1"> {booking.customerId} </p>
//                 </td>
//                 <td className="px-6 py-4">{booking.amount}</td>

//                 <td className="px-6 py-4">
//                   <p className="font-medium pb-1">{booking.paymentStatus}</p>
//                 </td>
//                 <td className="px-6 py-4">{booking.orderStatus}</td>
//                 <td className="px-6 py-4 flex items-center gap-4">
//                   <button
//                     onClick={() => setIsModalOpen(true)}
//                     className="py-1 px-1 bg-gray-100 rounded-md "
//                   >
//                     <IoEyeOutline size={18} />
//                   </button>
//                   <button className="px-1 py-1 bg-gray-100 rounded-md ">
//                     <FiEdit size={18} />
//                   </button>
//                   <button className="px-1 py-1 bg-gray-100 rounded-md ">
//                     <RiDeleteBin6Line size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Fixed Pagination Below Table */}
//       <div className="w-full bg-white sticky bottom-0 py-2 shadow-md">
//         <PaginationComponent
//           totalPages={totalPages}
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//         />
//       </div>
//       <OrderDetailsModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default LeadTable;
"use client";

import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import PaginationComponent from "@/components/common/PaginationComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads, updateLead } from "@/redux/dataSlice";

const statusOptions = ["fresh", "follow up", "complete", "pending", "discard"];

const initialLeads = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  fullName: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  contactNumber: `+91 98765${index}321`,
  message: "Looking for more information.",
  status: "fresh",
  note: "Lead just received",
}));

const LeadTable = ({ selectedDate }) => {
  const dispatch = useDispatch();
  const { searchText, allLeads, lead } = useSelector((state) => state.data);

  const [leads, setLeads] = useState(initialLeads);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editLeadId, setEditLeadId] = useState(null);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(true);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkNote, setBulkNote] = useState("");
  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    message: "",
    status: "",
    note: "",
  });

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0];
  };

  console.log(allLeads, "allLeads of contact us");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(
          fetchLeads({
            search: searchText,
            date: formatDateToYYYYMMDD(selectedDate),
            page: currentPage,
            itemPerPage,
          })
        ).unwrap();

        if (result?.count) {
          setTotalPages(Math.ceil(result.count / itemPerPage));
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchData();
  }, [dispatch, searchText, selectedDate, currentPage, itemPerPage, lead]);

  // console.log("my current page value", selectedDate);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentIds = currentData.map((item) => item.id);
    const allSelected = currentIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedLeads = leads.map((lead) =>
      lead.id === id
        ? {
            ...lead,
            status: newStatus,
            note: `Status set to ${newStatus}`,
          }
        : lead
    );
    setLeads(updatedLeads);
  };

  const openEditForm = (lead) => {
    setEditLeadId(lead.id);
    setEditData(lead);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    const updatedLeads = leads.map((lead) =>
      lead.id === editLeadId ? { ...lead, ...editData } : lead
    );
    await dispatch(
      updateLead({ leadId: editData?.id, updates: editData })
    ).unwrap();
    setLeads(updatedLeads);
    setEditLeadId(null);
  };
  const handleBulkUpdate = () => {
    const updatedLeads = leads.map((lead) =>
      selectedIds.includes(lead.id)
        ? {
            ...lead,
            status: bulkStatus || lead.status,
            note: bulkNote || lead.note,
          }
        : lead
    );

    console.log("Updated Leads (Locally) asdfasfd:", updatedLeads); // Log updated data

    setLeads(updatedLeads);
    setIsBulkEditOpen(false);
    setBulkStatus("");
    setBulkNote("");
  };

  return (
    <div className="relative font-inter max-w-full h-[65vh]">
      <div className="overflow-y-auto h-full custom-scrollbar border border-gray-300">
        <table className="min-w-full border-collapse text-left text-sm text-gray-500">
          <thead className="bg-[#ECF5FA] text-black text-nowrap sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={allLeads?.data?.every((row) =>
                    selectedIds.includes(row.id)
                  )}
                  onChange={handleSelectAll}
                />
              </th>
              {[
                "Full Name",
                "Email",
                "Contact Details",
                "Message",
                "Status",
                "Note",
                "Actions",
              ].map((heading, index) => (
                <th
                  key={index}
                  className="px-4 py-4 font-medium text-sm text-black bg-[#ECF5FA]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-medium font-poppins">
            {allLeads?.data?.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-gray-50 text-textColor text-sm border-b text-nowrap"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(lead?.id)}
                    onChange={() => handleSelect(lead?.id)}
                  />
                </td>
                <td className="px-4 py-4 text-black">{lead?.fullName}</td>
                <td className="px-4 py-4">{lead?.email}</td>
                <td className="px-4 py-4">{lead?.contactNumber}</td>
                <td className="px-4 py-4">{lead?.message}</td>
                <td className="px-4 py-4">
                  {/* <select
                    className="border border-gray-300 rounded p-1 text-sm"
                    value={lead?.status}
                    onChange={(e) =>
                      handleStatusChange(lead?.id, e.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select> */}
                  {lead?.status}
                </td>
                <td className="px-4 py-4">{lead?.note}</td>
                <td className="px-4 py-4 flex items-center gap-4">
                  <button
                    onClick={() => openEditForm(lead)}
                    className="px-1 py-1 bg-gray-100 rounded-md"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button className="px-1 py-1 bg-gray-100 rounded-md">
                    <IoEyeOutline size={18} />
                  </button>
                  <button className="px-1 py-1 bg-gray-100 rounded-md">
                    <RiDeleteBin6Line size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="w-full bg-white sticky bottom-0 py-2 shadow-md">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setItemPerPage={setItemPerPage}
        />
      </div>

      {/* Edit Modal */}
      {editLeadId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Lead</h2>
            {[
              "fullName",
              "email",
              "contactNumber",
              "message",
              "status",
              "note",
            ].map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                {field === "status" ? (
                  <select
                    className="w-full border p-2 rounded"
                    value={editData.status}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={editData[field]}
                    onChange={(e) => handleEditChange(field, e.target.value)}
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditLeadId(null)}
                className="px-4 py-2 rounded bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isBulkEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Bulk Edit Leads</h2>
            <div className="mb-4">
              <label className="block mb-1">Status</label>
              <select
                className="w-full border p-2 rounded"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
              >
                <option value="">Select status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Note</label>
              <textarea
                className="w-full border p-2 rounded"
                rows={3}
                value={bulkNote}
                onChange={(e) => setBulkNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsBulkEditOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpdate}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadTable;
