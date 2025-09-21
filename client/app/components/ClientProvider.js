// app/components/ClientProvider.js
"use client";

import { Provider } from "react-redux";
import { store } from "@/app/redux/store";

export default function ClientProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}