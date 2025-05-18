"use client";
import { addCoupon } from "@/redux/couponSlice";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";

const CouponFormModal = ({ isModalOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountPercentage: "",
    discountPrice: "",
    usageOfTime: "",
    status: "active",
    usedOfTime: 0,
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === "modalBackground") {
        onClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen, onClose]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name) errors.name = "Coupon Name is required";
    if (!formData.code) errors.code = "Coupon Code is required";
    if (
      !formData.discountPercentage ||
      formData.discountPercentage < 1 ||
      formData.discountPercentage > 100
    ) {
      errors.discountPercentage = "Enter a valid discount between 1-100%";
    }
    if (!formData.discountPrice || isNaN(formData.discountPrice)) {
      errors.discountPrice = "Discount Price must be a number";
    }
    if (!formData.usageOfTime || isNaN(formData.usageOfTime)) {
      errors.usageOfTime = "Usage must be a number";
    }
    if (!formData.startDate) errors.startDate = "Start Date is required";
    if (!formData.endDate) errors.endDate = "End Date is required";
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate >= formData.endDate
    ) {
      errors.endDate = "End Date must be after Start Date";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      code: "",
      discountPercentage: "",
      discountPrice: "",
      usageOfTime: "",
      status: "active",
      usedOfTime: 0,
      startDate: "",
      endDate: "",
    });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Prevents default form submission
    if (!validateForm()) return;
    console.log(formData, " coupun form data");
    try {
      setIsLoading(true);
      await dispatch(addCoupon(formData)).unwrap();
      handleCancel(); // ✅ Clears form & closes modal
    } catch (error) {
      console.error("Error adding coupon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="modalBackground"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white w-96 md:w-[500px] rounded-lg shadow-lg p-6 relative">
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 text-gray-600"
        >
          <RxCross2 size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Create Coupon
        </h2>
        {/* ✅ Form now has onSubmit */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Coupon Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Coupon Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
            />
            {errors.code && (
              <p className="text-red-500 text-xs">{errors.code}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">
              Discount Percentage (%)
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
            />
            {errors.discountPercentage && (
              <p className="text-red-500 text-xs">
                {errors.discountPercentage}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
            />
            {errors.discountPrice && (
              <p className="text-red-500 text-xs">{errors.discountPrice}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Usage of Time</label>
            <input
              type="number"
              name="usageOfTime"
              value={formData.usageOfTime}
              onChange={handleChange}
              className="border p-2 w-full rounded-md"
            />
            {errors.usageOfTime && (
              <p className="text-red-500 text-xs">{errors.usageOfTime}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs">{errors.endDate}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Create Coupon"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CouponFormModal;
