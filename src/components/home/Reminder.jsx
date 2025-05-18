"use client";
import { uploadImageToSupabase } from "@/lib/helperFunctions/uploadImageToSupabase";
import {
  addBanner,
  deleteAllBanners,
  deleteBanner,
  editBanner,
  fetchBanners,
} from "@/redux/couponSlice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Reminder() {
  const dispatch = useDispatch();
  const { topBanners } = useSelector((state) => state.coupon);
  // const [banners, setBanners] = useState([
  //   {
  //     subHeading: "Summer Collection",
  //     heading: "New Arrivals 2024",
  //     btnText: "Shop Now",
  //     link: "/summer-collection",
  //     image: "/assets/categories/c1.png",
  //   },
  //   {
  //     subHeading: "Special Offer",
  //     heading: "50% Off Selected Items",
  //     btnText: "View Deals",
  //     link: "/special-offers",
  //     image: "/assets/categories/c2.png",
  //   },
  //   {
  //     subHeading: "Limited Edition",
  //     heading: "Exclusive Collection",
  //     btnText: "Discover More",
  //     link: "/limited-edition",
  //     image: "/assets/categories/c3.png",
  //   },
  //   {
  //     subHeading: "Seasonal Sale",
  //     heading: "End of Season Clearance",
  //     btnText: "Shop Sale",
  //     link: "/clearance",
  //     image: "/assets/categories/c4.png",
  //   },
  //   {
  //     subHeading: "Summer Collectiwwon",
  //     heading: "New Arrivals 2024",
  //     btnText: "Shop Now",
  //     link: "/summer-collection",
  //     image: "/assets/categories/c1.png",
  //   },
  // ]);

  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    subHeading: "",
    heading: "",
    btnText: "",
    link: "",
    image: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchBanners()).unwrap();
    };
    fetchData();
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(addBanner(formData)).unwrap();
      await dispatch(fetchBanners()).unwrap();
      // After adding
      resetForm();
    } catch (error) {
      console.error("Error adding banner:", error);
    }
  };

  const handleEditBanner = async (data) => {
    try {
      setShowForm(true);
      setEditIndex(data?.id);
      setFormData({
        subHeading: data?.subHeading || "",
        heading: data?.heading || "",
        btnText: data?.btnText || "",
        link: data?.link || "",
        image: data?.image || "",
      });

      // console.log(formData, "my update form data");
      // const updatedData = { ...data, ...formData };
      // await dispatch(editBanner({ id: data?.id, updatedData })).unwrap();
      // After editing
      // resetForm();
    } catch (error) {
      console.error("Error editing banner:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await dispatch(
        editBanner({ id: editIndex, updatedData: formData })
      ).unwrap();
      await dispatch(fetchBanners()).unwrap();

      setShowForm(false);
      setEditIndex(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update banner:", error);
    }
  };

  // Common form reset
  const resetForm = () => {
    setFormData({
      subHeading: "",
      heading: "",
      btnText: "",
      link: "",
      image: "",
    });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteBanner(id)).unwrap();
  };

  const handleDeleteAll = async () => {
    await dispatch(deleteAllBanners()).unwrap();
  };

  return (
    <div
      className={`w-[27%] h-[60vh] bg-white font-inter border rounded-md transition-transform pb-5 duration-1000 ${
        isVisible ? "scale-100" : "scale-0"
      }`}
    >
      <div className="w-full h-full">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b h-[10vh] px-4">
          <h2 className="text-base font-semibold text-gray-800">
            Banner Images
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowForm(true);
                setEditIndex(null);
                setFormData({
                  subHeading: "",
                  heading: "",
                  btnText: "",
                  link: "",
                  image: "",
                });
              }}
              className="bg-primary text-white px-2 py-1 rounded-md text-sm"
            >
              Add New
            </button>
            <button
              onClick={handleDeleteAll}
              className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
            >
              Delete All
            </button>
          </div>
        </div>

        {showForm ? (
          <div className="p-4 overflow-y-auto h-[50vh]">
            <h3 className="font-semibold mb-3">
              {editIndex !== null ? "Edit Banner" : "Add New Banner"}
            </h3>
            <form className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Heading
                </label>
                <input
                  type="text"
                  name="subHeading"
                  value={formData.subHeading}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  name="btnText"
                  value={formData.btnText}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const uploadedUrl = await uploadImageToSupabase(file);
                      setFormData((prevData) => ({
                        ...prevData,
                        image: uploadedUrl,
                      }));
                    }
                  }}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex gap-2 mt-2">
                {editIndex ? (
                  <button
                    onClick={handleUpdate}
                    className="bg-primary text-white px-4 py-2 rounded-md text-sm"
                  >
                    Update
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-primary text-white px-4 py-2 rounded-md text-sm"
                  >
                    Submit
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-3 h-[50vh] overflow-y-auto custom-scrollbar pt-4">
            {topBanners?.length > 0 ? (
              topBanners?.map((banner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 px-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={banner?.image}
                        alt={banner?.heading}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/48/48";
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                      <h3 className="font-semibold text-gray-800">
                        {banner?.heading}
                      </h3>
                      <p className="font-normal text-gray-500">
                        {banner?.subHeading}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditBanner(banner)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(banner?.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No banner images added yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
