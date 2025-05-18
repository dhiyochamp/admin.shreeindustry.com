"use client";

import PaginationComponent from "@/components/common/PaginationComponent";
import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const CouponTable = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Table headings
  const tableHeadings = [
    "Coupon ID",
    "Coupon Name & Code",
    "Value",
    "Usage of Time",
    "Start Date",
    "End Date",
    "Status",
    "Actions",
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(coupons?.length / itemsPerPage);
  const currentData = coupons?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Create a Supabase client
  const supabase = createClientComponentClient();

  // Fetch coupons from Supabase
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('coupon')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setCoupons(data || []);
      } catch (err) {
        console.error("Error fetching coupons:", err);
        setError("Failed to load coupons");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [supabase]);

  // Handle delete coupon
  const handleDeleteCoupon = async (couponId) => {
    try {
      const { error } = await supabase
        .from('coupon')
        .delete()
        .eq('id', couponId);
      
      if (error) throw error;
      
      // Update the coupons list after deletion
      setCoupons(coupons.filter(coupon => coupon.id !== couponId));
    } catch (err) {
      console.error("Error deleting coupon:", err);
      alert("Failed to delete coupon. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[65vh]">Loading coupons...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-[65vh] text-red-500">{error}</div>;
  }

  return (
    <div className="relative font-inter max-w-full h-[65vh]">
      {/* Scrollable Table Container */}
      <div className="overflow-y-auto h-full custom-scrollbar border border-gray-300">
        <table className="min-w-full border-collapse text-left text-sm text-gray-500">
          {/* Fixed Header */}
          <thead className="bg-[#ECF5FA] text-black text-nowrap sticky top-0 z-10">
            <tr>
              <th className="px-8 py-4">
                <input
                  type="checkbox"
                  className="w-4 h-4 focus:outline-none focus:border-black"
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
            {currentData.length > 0 ? (
              currentData.map((coupon, index) => (
                <tr
                  key={coupon.id || index}
                  className="hover:bg-gray-50 text-textColor text-sm border-b text-nowrap"
                >
                  <td className="px-8 py-4 font-medium text-black text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 focus:outline-none focus:border-black"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-black text-sm">
                    {coupon.coupon_id || coupon.id}
                  </td>
                  <td className="px-6 py-2 flex gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-black">{coupon?.coupon_name || coupon?.name}</p>
                      <p className="">{coupon.coupon_code || coupon.code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <p className="text-black">{coupon?.discount_percentage || `${coupon?.discount_value}%`}</p>
                      <p className="">{coupon.max_discount_price ? `max Price: ${coupon.max_discount_price}` : ""}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">{coupon.usage_count || coupon.usage_of_time || 0}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium pb-1">{formatDate(coupon.start_date)}</p>
                  </td>
                  <td className="px-6 py-4">{formatDate(coupon.end_date)}</td>
                  <td className="px-6 py-4">{getCouponStatus(coupon)}</td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <button 
                      className="py-1 px-1 bg-gray-100 rounded-md"
                      title="View coupon details"
                    >
                      <IoEyeOutline size={18} />
                    </button>
                    <button 
                      className="px-1 py-1 bg-gray-100 rounded-md"
                      title="Edit coupon"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      className="px-1 py-1 bg-gray-100 rounded-md"
                      title="Delete coupon"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeadings.length + 1}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Fixed Pagination Below Table */}
      {coupons.length > 0 && (
        <div className="w-full bg-white sticky bottom-0 py-2 shadow-md">
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  } catch (error) {
    return dateString;
  }
}

// Helper function to determine coupon status
function getCouponStatus(coupon) {
  if (!coupon) return "Unknown";
  
  // If the coupon has an explicit status field, use that
  if (coupon.status) return coupon.status;
  
  // Otherwise, calculate status based on dates
  const now = new Date();
  const endDate = coupon.end_date ? new Date(coupon.end_date) : null;
  const startDate = coupon.start_date ? new Date(coupon.start_date) : null;
  
  if (endDate && now > endDate) {
    return "Expired";
  } else if (startDate && now < startDate) {
    return "Scheduled";
  } else {
    return "Active";
  }
}

export default CouponTable;
