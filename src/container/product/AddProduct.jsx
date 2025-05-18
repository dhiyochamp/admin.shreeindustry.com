"use client";

import AddMainCategoryModal from "@/components/category/AddMainCategoryModal";
import {
  addProduct,
  fetchAllProduct,
  fetchCategory,
  fetchProductsBySubCategory,
  fetchSubCategory,
  updateProduct,
} from "@/redux/dataSlice";
import { useEffect, useRef, useState } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddCategoryModal from "@/components/category/AddCategoryModal";
import { uploadImageToSupabase } from "@/lib/helperFunctions/uploadImageToSupabase";
import Image from "next/image";

export default function AddProduct({ onClose, data, setIsEdit, cat, sub }) {
  const dispatch = useDispatch();
  const { allSubCategory, allCategory } = useSelector((state) => state.data);
  const [openMainCat, setOpenMainCat] = useState(false);
  const [openSubCat, setOpenSubCat] = useState(false);
  const [productName, setProductName] = useState("");

  // const [price, setPrice] = useState("");

  const [inventory, setInventory] = useState("");
  const [outOfStock, setOutOfStock] = useState(false);
  const [pathName, setPathName] = useState("");

  const [shortDesc, setShortDesc] = useState("");
  // const [discountedPrice, setDiscountedPrice] = useState("");
  const [descriptions, setDescriptions] = useState([
    { title: "", description: "" },
  ]);
  const [reviews, setReviews] = useState([{ title: "", description: "" }]);
  const [specification, setSpecification] = useState([
    { title: "", description: "" },
  ]);

  const categoryType = [
    { id: 1, name: "trending" },
    { id: 2, name: "dailBestSeller" },
    { id: 3, name: "feature" },
    { id: 4, name: "dealOfDay" },
  ];

  const [productPricing, setProductPricing] = useState({
    price: "",
    discountPrice: "",
    rangePrice: {},
  });

  const handleInputChange = (field, value) => {
    setProductPricing((prev) => ({ ...prev, [field]: value }));
  };

  const handleRangePriceChange = (range, value) => {
    setProductPricing((prev) => ({
      ...prev,
      rangePrice: { ...prev.rangePrice, [range]: value },
    }));
    console.log(productPricing, "product pricing");
  };

  const [category, setSelectedCategory] = useState("");
  const [subCategory, setSelectedSubcategory] = useState("");
  const [category_type, setSelectedcategoryType] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const [selectedImages, setSelectedImages] = useState({
    right: "",
    left: "",
    top: "",
    bottom: "",
  });

  const fileInputRefs = {
    right: useRef(""),
    left: useRef(""),
    top: useRef(""),
    bottom: useRef(""),
  };
  const handleImageUpload = async (event, view) => {
    const file = event.target.files[0];
    const img = await uploadImageToSupabase(file);

    if (!img) return;
    setSelectedImages((prev) => ({ ...prev, [view]: img }));
  };

  const handleDynamicChange = (setter, index, field, value) => {
    setter((prevList) => {
      const updatedList = [...prevList];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return updatedList;
    });
  };

  const addDynamicField = (setter, newItem) => {
    setter((prev) => [...prev, newItem]);
  };

  const removeDynamicField = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setProductName("");
    // setPrice("");
    // setDiscountedPrice("");
    setProductPricing({ price: "", discountPrice: "", rangePrice: {} });
    setDescriptions([{ title: "", description: "" }]);
    setReviews([{ title: "", description: "" }]);
    setSpecification([{ title: "", description: "" }]);
    setPathName("");
    setSelectedImages({
      right: "",
      left: "",
      top: "",
      bottom: "",
    });
    Object.values(fileInputRefs).forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedcategoryType("");
    setShortDesc("");
    setInventory("");
    setOutOfStock(false);
    setFilteredSubCategories([]);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    // Validation Check
    if (!category || !subCategory || !category_type || !inventory) {
      toast.error("Please fill all the required fields!");
      console.error("Form validation failed: Missing required fields.");
      return; // Stop submission
    }

    const Newdata = {
      productName,
      productPricing,
      // discountedPrice,
      descriptions,
      reviews,
      specification,
      images: selectedImages,
      shortDesc,
      category,
      subCategory,
      category_type,
      outOfStock,
      inventory,
      pathName,
    };
    const updatedata = {
      id: data?.id,
      productName,
      productPricing,
      // discountedPrice,
      descriptions,
      reviews,
      specification,
      images: selectedImages,
      shortDesc,
      category,
      subCategory,
      category_type,
      outOfStock,
      inventory,
      pathName,
    };

    try {
      console.log(Newdata, "dafa");
      if (data?.id) {
        await dispatch(updateProduct(updatedata)).unwrap();
      } else {
        await dispatch(addProduct(Newdata)).unwrap();
      }
      // await dispatch(fetchAllProduct()).unwrap();
      handleCancel();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCategory()).unwrap();
        await dispatch(fetchSubCategory()).unwrap();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleBack = () => {
    if (setIsEdit) {
      setIsEdit(null);
    }
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (data) {
      setProductName(data.productName || "");
      setPathName(data.pathName || "");
      // setPrice(data.price || "");
      // setDiscountedPrice(data.discountedPrice || "");
      setProductPricing(
        data.productPricing || { price: "", discountPrice: "", rangePrice: {} }
      );
      setShortDesc(data.shortDesc || "");
      setInventory(data.inventory || "");
      setOutOfStock(data.outOfStock || false);
      setDescriptions(data.descriptions || [{ title: "", description: "" }]);
      setReviews(data.reviews || [{ title: "", description: "" }]);
      setSpecification(data.specification || [{ title: "", description: "" }]);
      setSelectedCategory(data.category || "");
      setSelectedSubcategory(data.subCategory || "");
      setSelectedcategoryType(data.category_type || "");
      setSelectedImages(
        data.images || { right: "", left: "", top: "", bottom: "" }
      );
    }

    if (cat && sub) {
      setSelectedCategory(cat || "");
      setSelectedSubcategory(sub || "");
    }
  }, [data, cat, sub]);

  const handleRemoveImage = (view) => {
    setSelectedImages((prev) => ({
      ...prev,
      [view]: "", // Remove the image
    }));
  };

  useEffect(() => {
    if (!category) {
      setFilteredSubCategories([]);
      return;
    }

    const filtered = allSubCategory?.filter((sub) => sub.category === category);
    setFilteredSubCategories(filtered);
  }, [category, allSubCategory]);

  return (
    <>
      <div className="p-5 flex items-start font-poppins">
        <div className="w-[70%] p-5 bg-white shadow-md rounded-lg border">
          <div className="flex items-center gap-10 pb-5">
            <div
              onClick={handleBack}
              className="flex items-center text-black cursor-pointer"
            >
              <IoChevronBackSharp />
              Back
            </div>
            <h2 className="text-base font-semibold ">
              {data ? "Edit Product" : "Add Product"}
            </h2>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Product Name */}
            <div className="space-y-1">
              <label className="block text-textColor text-sm">
                Product Name
              </label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:border-textColor"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-textColor text-sm">
                Product Path Name
              </label>
              <input
                value={pathName}
                onChange={(e) => setPathName(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:border-textColor"
                required
              />
            </div>

            {/* Price & Discounted Price */}

            {/*             
            <div className="flex gap-5">
              <div className="flex-1">
                <label className="block text-textColor text-sm">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-textColor"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-textColor text-sm">
                  Discounted Price
                </label>
                <input
                  type="number"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-textColor"
                  required
                />
              </div>
            </div> */}
            <div className="flex gap-5">
              {/* Price Input */}
              <div className="flex-1">
                <label className="block text-textColor text-sm">Price</label>
                <input
                  type="number"
                  value={productPricing.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-textColor"
                  required
                />
              </div>
              {/* Discounted Price Input */}
              <div className="flex-1">
                <label className="block text-textColor text-sm">
                  Discounted Price
                </label>
                <input
                  type="number"
                  value={productPricing.discountPrice}
                  onChange={(e) =>
                    handleInputChange("discountPrice", e.target.value)
                  }
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-textColor"
                  required
                />
              </div>
            </div>

            {/* Range Price Inputs */}
            <div className="w-full space-y-2">
              <label className="block text-textColor text-sm">
                Range Prices
              </label>
              <div className="w-full grid grid-cols-2 gap-5">
                {["5-10", "10-15", "15-20", "20-50"].map((range) => (
                  <div key={range} className="flex items-center gap-3">
                    <span className="w-16 text-sm">{range}</span>
                    <input
                      type="number"
                      value={productPricing.rangePrice[range] || ""}
                      onChange={(e) =>
                        handleRangePriceChange(range, e.target.value)
                      }
                      className="w-full p-2 border rounded-md focus:outline-none focus:border-textColor"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-textColor text-sm">
                Short description (In one or two line)
              </label>
              <input
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:border-textColor"
                required
              />
            </div>
            {/* Product Descriptions */}
            <div>
              <h3 className="text-sm text-textColor space-y-1 mb-1">
                Product Descriptions
              </h3>
              <div className="flex flex-col gap-2">
                {descriptions.map((desc, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={desc.title}
                      onChange={(e) =>
                        handleDynamicChange(
                          setDescriptions,
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Title"
                      className="w-[40%] p-2 border rounded-md focus:outline-none focus:border-textColor text-sm placeholder:text-sm"
                    />
                    <input
                      value={desc.description}
                      onChange={(e) =>
                        handleDynamicChange(
                          setDescriptions,
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Description"
                      className="w-[60%] p-2 border rounded-md focus:outline-none focus:border-textColor text-sm placeholder:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeDynamicField(setDescriptions, index)}
                      className="text-red-500 bg-red-200 py-0.5 px-2 rounded-md"
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  addDynamicField(setDescriptions, {
                    title: "",
                    description: "",
                  })
                }
                className="text-primary text-sm pt-2"
              >
                + Add Description
              </button>
            </div>

            {/* Product Reviews */}
            <div>
              <h3 className="text-sm text-textColor space-y-1 mb-1">
                Product Reviews
              </h3>
              <div className="flex flex-col gap-2">
                {reviews.map((review, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={review.title}
                      onChange={(e) =>
                        handleDynamicChange(
                          setReviews,
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Title"
                      className="w-[40%] p-2 border rounded-md focus:outline-none focus:border-textColor text-sm placeholder:text-sm"
                    />
                    <input
                      value={review.description}
                      onChange={(e) =>
                        handleDynamicChange(
                          setReviews,
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Review"
                      className="w-[60%] p-2 border rounded-md focus:outline-none focus:border-textColor text-sm placeholder:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeDynamicField(setReviews, index)}
                      className="text-red-500 bg-red-200 py-0.5 px-2 rounded-md"
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  addDynamicField(setReviews, { title: "", description: "" })
                }
                className="text-primary text-sm pt-2"
              >
                + Add Review
              </button>
            </div>

            {/* Image Uploads */}
            <h3 className="text-base text-textColor text-nowrap">
              Product Images
            </h3>

            {data?.images ? (
              <div className="flex items-center justify-between flex-wrap gap-5">
                {Object.keys(selectedImages).map((view) => (
                  <div key={view} className="relative">
                    {selectedImages[view] ? (
                      <div className="relative">
                        <Image
                          src={selectedImages[view]}
                          alt={view}
                          height={80}
                          width={80}
                          className="rounded-md border"
                        />
                        <button
                          onClick={() => handleRemoveImage(view)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ✖
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-textColor text-sm capitalize">
                          {view} View
                        </label>
                        <input
                          ref={fileInputRefs[view]} // Attach ref to reset input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, view)}
                          required
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-5">
                {["right", "left", "top", "bottom"].map((view) => (
                  <div key={view}>
                    <label className="block text-textColor text-sm capitalize">
                      {view} View
                    </label>
                    <input
                      ref={fileInputRefs[view]} // Attach ref to reset input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, view)}
                      required
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Product Descriptions */}
            <div className="pt-4">
              <h3 className="text-sm text-textColor text-nowrap space-y-1 mb-1">
                Product Specification
              </h3>
              {specification.map((desc, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={desc.title}
                    onChange={(e) =>
                      handleDynamicChange(
                        setSpecification,
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="name"
                    className="w-[40%] p-2 border rounded-md focus:outline-none focus:border-textColor text-sm placeholder:text-sm"
                  />
                  <input
                    value={desc.description}
                    onChange={(e) =>
                      handleDynamicChange(
                        setSpecification,
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="value"
                    className="w-[60%] p-2 border rounded-md focus:outline-none focus:border-textColor text-sm placeholder:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeDynamicField(setSpecification, index)}
                    className="text-red-500 bg-red-200 py-0.5 px-2 rounded-md"
                  >
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  addDynamicField(setSpecification, {
                    title: "",
                    description: "",
                  })
                }
                className="text-primary text-sm pt-2"
              >
                + Add Description
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-8 pt-8">
              <button
                onClick={handleCancel}
                className="bg-transparent border border-textColor text-textColor px-3 py-1.5 rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-sm"
              >
                {data ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>

        <div className="w-[30%] px-10 flex flex-col gap-5">
          <div className="py-3 px-5 bg-white shadow-sm rounded-lg w-64 border">
            <div className=" flex flex-col gap-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  Inventory
                </label>
                <input
                  type="text"
                  name="inventory"
                  value={inventory}
                  onChange={(e) => setInventory(e.target.value)}
                  className="w-full p-1 border rounded-md focus:outline-none focus:border-textColor"
                />
              </div>
              <div className="space-y-2 mb-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  Out of Stock
                </label>
                <div
                  className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
                    outOfStock ? "bg-green-400" : "bg-gray-300"
                  }`}
                  onClick={() => setOutOfStock(!outOfStock)}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      outOfStock ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-3 px-5 bg-white shadow-sm rounded-lg w-64 border">
            <h2 className="text-lg font-semibold text-textColor mb-3">
              Categories
            </h2>
            <div className="space-y-2">
              {allCategory.length === 0 && (
                <p className="text-sm text-red-600">
                  category not created yet{""}
                </p>
              )}
              {allCategory?.map((cate) => (
                <label
                  key={cate.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cate.id}
                    checked={category === cate.id}
                    onChange={() => setSelectedCategory(cate.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-textColor text-sm">{cate.name}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setOpenMainCat(true)}
              className="text-blue-500 mt-3 block"
            >
              Create New
            </button>
          </div>
          {category && (
            <div className="py-3 px-5 bg-white shadow-md rounded-lg w-64 border">
              <h2 className="text-lg font-semibold text-textColor mb-3">
                Subcategories
              </h2>
              <div className="space-y-2">
                {filteredSubCategories.length === 0 && (
                  <p className="text-sm text-red-600">
                    sub-category not created yet{""}
                  </p>
                )}

                {filteredSubCategories?.map((subcategory) => (
                  <label
                    key={subcategory?.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="subcategory"
                      value={subcategory?.id}
                      checked={subCategory === subcategory.id}
                      onChange={() => setSelectedSubcategory(subcategory.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-textColor text-sm">
                      {subcategory.name}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setOpenSubCat(true)}
                className="text-blue-500 mt-3 block"
              >
                Create New
              </button>
            </div>
          )}
          <div className="py-3 px-5 bg-white shadow-md rounded-lg w-64 border">
            <h2 className="text-lg font-semibold text-textColor mb-3">
              Category Type
            </h2>
            <div className="space-y-2">
              {categoryType?.map((subcategory) => (
                <label
                  key={subcategory.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="categoryType"
                    value={subcategory.name}
                    checked={category_type === subcategory.name}
                    onChange={() => setSelectedcategoryType(subcategory.name)}
                    className="w-4 h-4"
                  />
                  <span className="text-textColor text-sm">
                    {subcategory.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {openMainCat && (
        <AddMainCategoryModal isOpen={openMainCat} setIsOpen={setOpenMainCat} />
      )}

      {openSubCat && (
        <AddCategoryModal isOpen={openSubCat} setIsOpen={setOpenSubCat} />
      )}
      {/* here I have open the main category pop up also I will do this when I work with API's */}
    </>
  );
}
