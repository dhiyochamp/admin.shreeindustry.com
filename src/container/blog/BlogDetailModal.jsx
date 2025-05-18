import React, { useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { X, Calendar, Tag, Clock } from "lucide-react";

const BlogDetailModal = ({ isOpen, onClose }) => {
  const { webStories, allSubCategory } = useSelector((state) => state.data);

  const getSubCategoryNameById = (id) =>
    allSubCategory?.find((item) => item?.id === id)?.name || null;

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !webStories) return null;

  const formattedDate = webStories?.date
    ? new Date(webStories.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No date available";

  const readTime = webStories?.readTime || "5 min read";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full p-0 relative overflow-hidden animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-800/90 rounded-full p-1 shadow-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="relative w-full h-64">
          <Image
            src={webStories?.image || "/api/placeholder/600/400"}
            alt={webStories?.heading || "Blog post"}
            layout="fill"
            objectFit="cover"
            className="w-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex space-x-4 text-xs text-white mb-2">
              {webStories?.date && (
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>{formattedDate}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{readTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
            {webStories?.heading}
          </h2>

          {getSubCategoryNameById(webStories?.category) && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Tag size={14} className="mr-1" />
                {getSubCategoryNameById(webStories?.category)}
              </span>
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {webStories?.description}
            </p>
          </div>

          {webStories?.author && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                  {webStories?.authorImage ? (
                    <Image
                      src={webStories.authorImage}
                      alt={webStories.author}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {webStories.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {webStories.author}
                  </h4>
                  {webStories?.authorTitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {webStories.authorTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailModal;
