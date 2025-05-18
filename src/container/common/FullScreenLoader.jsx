// components/FullScreenLoader.jsx
import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"
            style={{
              animationDirection: "reverse",
              borderColor: "blue",
              borderTopColor: "transparent",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
