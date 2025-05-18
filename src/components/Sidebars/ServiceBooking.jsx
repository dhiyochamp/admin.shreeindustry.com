import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import SidebarInputbox from "../common/SidebarInputbox";

export default function ServiceBooking({ isOpen, onClose }) {
  const sidebarRef = useRef();

  const [formData, setFormData] = useState({
    bookingId: "BK-WZ1001",
    bookingDate: "2028-08-01",
    clientName: "Alice Johnson",
    carModel: "Toyota Corolla",
    carNumber: "TX1234",
    plan: "Rs.1235",
    payment: "pending",
    status: "complete",
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(formData, "form data");
  };

  const handleReset = () => {
    setFormData({
      bookingId: "",
      bookingDate: "",
      clientName: "",
      carModel: "",
      carNumber: "",
      plan: "",
      payment: "",
      status: "",
    });
  };
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-[13vh] inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed top-[13vh] right-0 h-[87vh] w-[40%] bg-white shadow-lg transform font-poppins ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-500 ease-in-out z-50 overflow-auto`}
      >
        <div
          ref={sidebarRef}
          className="relative p-6 overflow-y-auto h-full custom-scrollbar"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-4 p-1 bg-red-100 rounded-md hover:bg-black text-primary hover:text-white"
          >
            <IoClose size={20} className="" />
          </button>
          <h2 className="text-xl font-semibold mb-4">Service Booking</h2>

          <form className="space-y-4">
            <SidebarInputbox
              label="Booking ID"
              value={formData.bookingId}
              onChange={(value) => handleInputChange("bookingId", value)}
              isEditable={false}
            />
            <SidebarInputbox
              label="Booking Date"
              value={formData.bookingDate}
              onChange={(value) => handleInputChange("bookingDate", value)}
              type="date"
            />
            <SidebarInputbox
              label="Client Name"
              value={formData.clientName}
              onChange={(value) => handleInputChange("clientName", value)}
            />
            <SidebarInputbox
              label="Car Model"
              value={formData.carModel}
              onChange={(value) => handleInputChange("carModel", value)}
            />
            <SidebarInputbox
              label="Car Number"
              value={formData.carNumber}
              onChange={(value) => handleInputChange("carNumber", value)}
            />
            <SidebarInputbox
              label="Plan"
              value={formData.plan}
              onChange={(value) => handleInputChange("plan", value)}
            />
            <SidebarInputbox
              label="Payment"
              value={formData.payment}
              onChange={(value) => handleInputChange("payment", value)}
              type="select"
            />
            <SidebarInputbox
              label="Status"
              value={formData.status}
              onChange={(value) => handleInputChange("status", value)}
              type="select"
            />

            <div className="flex items-center gap-8 pt-5">
              <button
                onClick={handleSubmit}
                type="button"
                className="bg-[#223142] text-white px-5 py-2 rounded-sm"
              >
                Create Booking
              </button>
              <button
                type="button"
                className="bg-primary text-white px-5 py-2 rounded-sm"
              >
                Save as Draft
              </button>
              <button
                onClick={handleReset}
                type="button"
                className="bg-[#F0F0F0] text-black px-5 py-2 rounded-sm"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
