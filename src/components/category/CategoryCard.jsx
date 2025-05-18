"use client";

import Image from "next/image";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { LuView } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

export default function CategoryCard({
  category,
  setDeleteConfirm,
  toggleView,
  setIsOpen,
  setSubCatData,
  setDeleteType,
  setViewData,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleEditSubCat = (category) => {
    setSubCatData(category);
    setIsOpen(true);
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-44 border ${
          isHovered ? "bg-black opacity-50" : ""
        }`}
      >
        <Image
          src={category.imageUrl}
          alt={category.name}
          //   height={200}
          //   width={200}
          fill
          sizes="100vw"
          style={{ objectFit: "covers" }}
          unoptimized
        />
      </div>
      {isHovered && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-5">
          <button
            onClick={() => {
              toggleView();
              setViewData(category);
            }}
            className="bg-white text-primary px-2 py-1 text-sm rounded-lg flex items-center"
          >
            <LuView className="w-4 h-4 mr-1" /> View
          </button>
        </div>
      )}
      <div className="p-4 flex items-center justify-between">
        <div className="">
          <h3 className="text-sm font-semibold">{category.name}</h3>
          <p className="text-gray-500 text-sm -pl-2">{category.pathName}</p>
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={() => handleEditSubCat(category)}
            className="bg-blue-200 text-primary border border-primary hover:text-white hover:bg-blue-600 hover:border-none px-2 py-1 text-sm rounded-lg flex items-center"
          >
            <CiEdit className="w-4 h-4 mr-1" />
          </button>
          <button
            onClick={() => {
              setDeleteConfirm(category?.id);
              setDeleteType("sub");
            }}
            className="bg-red-200 text-red-800 border border-red-800 hover:text-white hover:bg-red-600 hover:border-none px-2 py-1 text-sm rounded-lg flex items-center"
          >
            <MdDelete className="w-4 h-4 mr-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
