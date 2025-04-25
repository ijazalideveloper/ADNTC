"use client";

import React from "react";
import { AuthProvider } from "@/lib/context/authContext";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;
