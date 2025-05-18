"use client";

import Image from "next/image";
import React, { useState } from "react";
import { RiPieChartFill } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { HiShoppingBag } from "react-icons/hi";
import { HiInboxIn, HiCollection } from "react-icons/hi";
import { FaLock, FaClipboardList } from "react-icons/fa";
import { MdOutlineSupport } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

// Menu items configuration with dropdown data
const menuItems = [
  { id: 1, name: "Dashboard", icon: RiPieChartFill, link: "/" },
  {
    id: 2,
    name: "Categories",
    icon: HiDocumentReport,
    link: "/categories",
    // dropdownData: [
    //   { name: "All Categories", link: "/categories" },
    //   { name: "Product", link: "/categories/product" },
    //   { name: "Plant", link: "/categories/plant" },
    // ],
  },
  {
    id: 3,
    name: "Product",
    icon: HiDocumentReport,
    link: "/product",
  },
  {
    id: 4,
    name: "Customer",
    icon: HiShoppingBag,
    link: "/customer",
  },
  {
    id: 5,
    name: "order",
    icon: FaLock,
    link: "/order",
  },
  { id: 11, name: "Leads", icon: MdOutlineSupport, link: "/leads" },
  { id: 6, name: "Payments", icon: HiInboxIn, link: "/payment" },
  { id: 7, name: "Coupon", icon: FaClipboardList, link: "/coupon" },
  { id: 8, name: "SEO", icon: HiCollection, link: "/seo" },
  { id: 9, name: "Blog", icon: MdOutlineSupport, link: "/blog" },
  { id: 10, name: "Web-stories", icon: MdOutlineSupport, link: "/web-stories" },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState(null);
  const [dropdownActive, setDropdownActive] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [collapse, setCollapse] = useState(false);
  // Handle tab click
  const handleTabClick = (index, hasDropdown) => {
    if (hasDropdown) {
      setDropdownActive(dropdownActive === index ? null : index);
    } else {
      setDropdownActive(null);
      setActiveTab(index);
      setSelectedItem(null);
    }
  };

  // Handle dropdown item click
  const handleDropdownClick = (parentIndex, item) => {
    setActiveTab(parentIndex);
    setSelectedItem(item);
  };

  return (
    <div
      className={`min-h-screen bg-white shadow-md flex flex-col font-inter transition-all duration-300 border ${
        collapse ? "w-20" : "w-56"
      }`}
    >
      {/* Logo Section */}
      <div className="h-[13vh] px-6 flex items-center justify-center border-b relative">
        <Image src="/assets/logo.svg" alt="luxe" height={120} width={120} />
        <div
          onClick={() => setCollapse(!collapse)}
          className=" absolute top-1/3 -right-4  z-20 flex items-center text-gray-500 bg-gray-200 rounded-sm py-1"
        >
          <IoIosArrowBack />
          <IoIosArrowForward />
        </div>
      </div>
      {/* Menu Section */}
      <div className="flex flex-col gap-3 mt-2 h-[87vh] custom-scrollbar">
        {menuItems.map((item, index) => (
          <div key={item.id}>
            {/* Menu Item */}
            <div
              className={`cursor-pointer transition-all duration-200  px-2 ${
                item.id === 5 ? "border-b  rounded-none pb-8" : ""
              } ${item.id === 6 ? "mt-2" : ""}`}
            >
              <div
                onClick={() => handleTabClick(index, !!item.dropdownData)}
                className={`flex items-center justify-between px-6 py-2 group  ${
                  activeTab === index
                    ? "text-primary"
                    : dropdownActive === index
                    ? "bg-gray-100 text-gray-500"
                    : "hover:bg-gray-100 text-gray-500 rounded-lg"
                } `}
              >
                <Link href={item.link}>
                  <div className="flex items-center gap-4 relative ">
                    <item.icon size={24} />
                    {!collapse && (
                      <p className="text-base font-medium text-nowrap">
                        {item.name}
                      </p>
                    )}
                    {/* Tooltip for Icons */}
                    {collapse && (
                      <div className="absolute left-10 z-[99] top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all duration-300 bg-black text-white text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ">
                        {item.name}
                      </div>
                    )}
                  </div>
                </Link>

                {/* Right Section: Conditional Arrow */}
                {item.dropdownData && (
                  <MdKeyboardArrowDown
                    size={20}
                    className={`transition-transform ${
                      dropdownActive === index ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Dropdown Content */}
            {dropdownActive === index && item.dropdownData && (
              <div className=" flex flex-col justify-center items-center gap-2 bg-white py-2">
                {item.dropdownData.map((dataItem, i) => (
                  <Link href={dataItem.link}>
                    <div
                      key={i}
                      onClick={() => handleDropdownClick(index, dataItem)}
                      className={`flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-4 py-1 rounded-lg ${
                        selectedItem === dataItem
                          ? "text-primary"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                      <p className="text-sm">{dataItem.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
