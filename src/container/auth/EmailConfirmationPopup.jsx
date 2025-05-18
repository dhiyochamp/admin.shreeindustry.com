// components/EmailConfirmationPopup.js
"use client ";
import { useState, useEffect } from "react";

export default function EmailConfirmationPopup({ isVisible, setIsVisible }) {
  const closePopup = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-96 animate-fade-in-up overflow-hidden">
            {/* Header with close button */}
            <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3">
              <h3 className="font-medium text-lg">Email Verification</h3>
              <button
                onClick={closePopup}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Email icon */}
            <div className="flex justify-center pt-6">
              <div className="rounded-full bg-blue-100 p-3">
                <svg
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4 text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Verify Your Email Address
              </h4>
              <p className="text-gray-600 mb-4">
                We've sent a verification link to your email address. Please
                check your inbox and click the link to activate your account.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                If you don't see the email, check your spam folder or request a
                new verification link.
              </p>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-3 flex justify-center space-x-3">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded"
              >
                I'll do it later
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded"
                onClick={() => window.open("https://mail.google.com", "_blank")}
              >
                Open my email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
