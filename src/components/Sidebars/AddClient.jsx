import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import SidebarInputbox from "../common/SidebarInputbox";
import DocumentInputBox from "../common/DocumentInputBox";

export default function AddClient({
  isOpen,
  onClose,
  checkType,
  EditData,
  setCheckType,
}) {
  const sidebarRef = useRef();

  const [formData, setFormData] = useState({
    client: {
      image: "/",
      name: EditData?.client?.name || "",
      email: EditData?.client?.email || "",
    },
    phoneNo: EditData?.phoneNo || "",
    address: EditData?.address || "",
    documents: EditData?.documents || [],
    points: EditData?.points || "",
  });
  console.log(EditData, "Edit data form data");

  const handleInputChange = (field, value) => {
    setFormData((prevData) => {
      if (field.startsWith("client.")) {
        const key = field.split(".")[1];
        return {
          ...prevData,
          client: {
            ...prevData.client,
            [key]: value,
          },
        };
      }
      return {
        ...prevData,
        [field]: value,
      };
    });
  };

  const handleDocumentChange = (files) => {
    setFormData((prevData) => ({
      ...prevData,
      documents: files,
    }));
  };

  const handleSubmit = () => {
    const actionType = checkType ? "Adding Client" : "Editing Client";
    console.log(`${actionType} with data:`, formData);
    if (checkType) {
      setCheckType("Add client");
    }
  };

  const handleReset = () => {
    setFormData({
      client: {
        image: "/",
        name: "",
        email: "",
      },
      phoneNo: "",
      address: "",
      documents: [],
      points: "",
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
            <IoClose size={20} />
          </button>
          <h2 className="text-xl font-semibold mb-4">
            {checkType ? "Add Client" : "Edit Client"}
          </h2>

          <form className="space-y-4">
            <SidebarInputbox
              label="Client Name"
              value={formData?.client?.name || ""}
              onChange={(value) => handleInputChange("client.name", value)}
              isEditable={false}
              type="text"
              checkType={checkType}
            />
            <SidebarInputbox
              label="Email"
              value={formData?.client?.email || ""}
              onChange={(value) => handleInputChange("client.email", value)}
              type="email"
              checkType={checkType}
            />
            <SidebarInputbox
              label="PhoneNo"
              value={formData?.phoneNo || ""}
              onChange={(value) => handleInputChange("phoneNo", value)}
              checkType={checkType}
            />
            <SidebarInputbox
              label="Address"
              value={formData?.address || ""}
              onChange={(value) => handleInputChange("address", value)}
              checkType={checkType}
            />

            <DocumentInputBox
              maxFiles={3}
              onFilesChange={handleDocumentChange}
            />

            <SidebarInputbox
              label="Points"
              value={formData?.points || ""}
              onChange={(value) => handleInputChange("points", value)}
              checkType={checkType}
            />

            <div className="flex items-center gap-8 pt-5">
              <button
                onClick={handleSubmit}
                type="button"
                className="bg-[#223142] text-white px-5 py-2 rounded-sm"
              >
                {checkType ? "Create Client" : "Save Changes"}
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
