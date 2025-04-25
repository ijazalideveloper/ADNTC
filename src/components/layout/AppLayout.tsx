"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import useAuth from "@/lib/hooks/useAuth";
import styles from "@/styles/layouts/_layout.module.scss";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={logout}
        toggleSidebar={toggleSidebar}
      />
      <div className="app-wrapper">
        {isAuthenticated && <Sidebar isOpen={isSidebarOpen} />}
        <main
          className={`${styles.main} ${
            !isAuthenticated || !isSidebarOpen ? styles.fullWidth : ""
          }`}
        >
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AppLayout;
