"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store.js";

const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
