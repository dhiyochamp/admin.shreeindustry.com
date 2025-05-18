"use client";

import Image from "next/image";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      window.location.reload(); // Refresh the page after logout
    } catch (error) {
      console.log(error, "error while logout");
    }
  };

  return (
    <div className="h-[13vh] w-full font-inter bg-white border absolute top-0 right-0 z-10">
      <div className="h-full w-full flex items-center justify-between px-8">
        {/* Left side - Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hello Luxe 👋🏻</h1>
        </div>

        {/* Right side - Search bar, notifications, and profile */}
        <div className="flex gap-6 items-center">
          {/* Search bar */}
          <div className="relative flex items-center w-96">
            <CiSearch size={20} className="absolute left-4 text-primary" />
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full pl-12 pr-4 py-2 text-base font-inter font-normal border border-gray-300 rounded-full focus:border-primary focus:outline-none"
            />
          </div>

          {/* Notifications */}
          <div className="relative flex justify-center items-center w-10 h-10 rounded-full bg-white border border-gray-300">
            <IoNotificationsOutline size={22} className="text-gray-600" />
            <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-primary rounded-full border border-white"></div>
          </div>

          {/* Profile */}
          <div className="relative">
            <div
              className="flex items-center gap-4 pl-3 pr-4 py-1.5 bg-white border border-gray-300 rounded-full cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="relative w-10 h-10 mt-1">
                <Image
                  src="/assets/profile.png"
                  alt="profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-gray-800">
                  Alex Meian
                </p>
                <p className="text-xs text-gray-500">Product Manager</p>
              </div>
              <IoIosArrowDown size={20} className="text-gray-600" />
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-2 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                <ul className="py-2 text-sm text-gray-700">
                  {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Profile
                  </li> */}
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Change Password
                  </li>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
