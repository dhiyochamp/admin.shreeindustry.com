import { IoChevronBackSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import Image from "next/image";

export default function ProductPreview({ isOpen, onClose, product }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-inter">
      <div className="w-[70%] max-h-[80vh] overflow-y-auto p-5 bg-white shadow-md rounded-lg border relative">
        <div className="flex items-center gap-10 pb-5">
          <div
            onClick={onClose}
            className="flex items-center text-black cursor-pointer"
          >
            <IoChevronBackSharp /> Back
          </div>
          <h2 className="text-base font-semibold ">
            {product ? "Product Details" : "No Product Data"}
          </h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-textColor text-sm font-bold">Product Name</h3>
            <p className="text-gray-700">{product?.productName || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-textColor text-sm font-bold">
              Product Path Name
            </h3>
            <p className="text-gray-700">{product?.pathName || "N/A"}</p>
          </div>
          <div className="space-y-4 p-4 border rounded-lg">
            {/* Main Prices */}
            <div className="flex gap-5">
              <div className="flex-1">
                <h3 className="text-textColor text-sm font-bold">Price</h3>
                <p className="text-gray-700">
                  ₹{product?.productPricing?.price || "0"}
                </p>
              </div>
              <div className="flex-1">
                <h3 className="text-textColor text-sm font-bold">
                  Discounted Price
                </h3>
                <p className="text-gray-700">
                  ₹{product?.productPricing?.discountPrice || "0"}
                </p>
              </div>
            </div>

            {/* Range Prices */}
            <div>
              <h3 className="text-textColor text-sm font-bold">
                Range Pricing
              </h3>
              <div className="space-y-2 ">
                {product?.productPricing?.rangePrice
                  ? Object.entries(product?.productPricing?.rangePrice).map(
                      ([range, price]) => (
                        <div key={range} className="flex justify-between">
                          <span className="text-gray-700">{range}</span>
                          <span className="text-gray-700 font-medium">
                            ₹{price}
                          </span>
                        </div>
                      )
                    )
                  : "No range pricing available"}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-textColor text-sm font-bold">
              Short Description
            </h3>
            <p className="text-gray-700">{product?.shortDesc || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm text-textColor font-bold mb-1">
              Product Descriptions
            </h3>
            <ul className="list-disc pl-5">
              {product?.descriptions?.map((desc, index) => (
                <li key={index} className="text-gray-700">
                  <strong>{desc.title}:</strong> {desc.description}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm text-textColor font-bold mb-1">
              Product Images
            </h3>
            <div className="flex flex-wrap gap-5">
              {Object.values(product?.images || {}).map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt="Product Image"
                  height={80}
                  width={80}
                  className="rounded-md border"
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm text-textColor font-bold mb-1">
              Specifications
            </h3>
            <ul className="list-disc pl-5">
              {product?.specification?.map((spec, index) => (
                <li key={index} className="text-gray-700">
                  <strong>{spec.title}:</strong> {spec.description}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
