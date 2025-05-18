// // Add "use client" directive to make this a Client Component
// "use client";

// import { useSelector } from "react-redux";
// import Navbar from "@/container/layout/Navbar";
// import Sidebar from "@/container/layout/Sidebar";
// import { Toaster } from "react-hot-toast";
// import { useEffect, useState } from "react";
// import useAuth from "@/lib/helperFunctions/useAuth";
// import { useRouter } from "next/navigation";

// export default function ClientLayout({ children }) {
//   const router = useRouter();
//   const { isauth } = useSelector((state) => state.auth);
//   const user = useAuth(); // Get the user from the hook

//   if (!user) {
//     // Optionally, render loading or return null if user is not authenticated
//     router.push("/auth");
//   }

//   return (
//     <div className="flex overflow-hidden h-screen">
//       {isauth && <Sidebar />}
//       <div className="w-full h-screen transition-all duration-300 ease-in-out relative">
//         {isauth && <Navbar />}
//         <div className="pt-4 h-[100vh] overflow-hidden bg-[#F9F9F9]">
//           <Toaster position="top-right" reverseOrder={false} />
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

//   const [user, setUser] = useState(null);
//   useEffect(() => {
//     const fetchUser = async () => {
//       const authenticatedUser = await useAuth(); // Ensure useAuth runs on render
//       if (authenticatedUser) {
//         dispatch(setIsAuth());
//         setUser(authenticatedUser);
//       }
//     };

//     fetchUser();
//   }, []);
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/container/layout/Navbar";
import Sidebar from "@/container/layout/Sidebar";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { checkUserSession } from "@/redux/authSlice";

export default function ClientLayout({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(checkUserSession()).unwrap();
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setIsAuthChecked(true); // Auth check is done
      }
    };
    initAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthChecked) return; // Wait until auth check is completed

    if (user?.email && pathname === "/auth") {
      router.replace("/");
    } else if (!user?.email && pathname !== "/auth") {
      router.replace("/auth");
    }
  }, [user?.email, pathname, router, isAuthChecked]);

  return (
    <div className="flex overflow-hidden h-screen">
      {user?.email && <Sidebar />}
      <div className="w-full h-screen transition-all duration-300 ease-in-out relative">
        {user?.email && <Navbar />}
        <div className="pt-4 h-[100vh] overflow-hidden bg-[#F9F9F9]">
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </div>
      </div>
    </div>
  );
}
