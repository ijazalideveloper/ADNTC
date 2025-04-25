import React, { useState } from "react";
import Link from "next/link";
import styles from "@/styles/layouts/_layout.module.scss";
import Button from "@/components/ui/Button";

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  onLogout,
  toggleSidebar,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className="flex items-center">
          {isAuthenticated && (
            <button
              className={styles.menuToggle}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          <Link href="/" className={styles.logo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Task Manager
          </Link>
        </div>

        <button
          className={styles.menuToggle}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>

        <nav
          className={`${styles.nav} ${
            isMobileMenuOpen ? styles.mobileOpen : ""
          }`}
        >
          {!isAuthenticated ? (
            <>
              <Link href="/auth/login" className={styles.navItem}>
                Login
              </Link>
              <Link href="/auth/signup" className={styles.navItem}>
                <Button variant="primary" size="small">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={toggleUserMenu}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width="24"
                  height="24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Account</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width="16"
                  height="16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isUserMenuOpen && (
                <div className={styles.userMenuDropdown}>
                  <Link href="/profile" className={styles.userMenuLink}>
                    Profile
                  </Link>
                  <Link href="/settings" className={styles.userMenuLink}>
                    Settings
                  </Link>
                  <button
                    className={styles.userMenuLink}
                    onClick={onLogout}
                    style={{ width: "100%", textAlign: "left" }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
