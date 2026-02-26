"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { BsHandbag } from "react-icons/bs";
import {
  FaSearch,
  FaSignOutAlt,
  FaUser,
  FaSignInAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const user = { _id: "admin", role: "admin" };

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const logoutHandler = () => {
    setIsOpen(false);
    setIsMobileMenuOpen(false);
    console.log("logout...");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="navbar">
      {/* Hamburger Menu Button */}
      <button
        className="hamburger-menu"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Logo/Brand (Optional) */}
      <div className="navbar-brand">
        <Link href="/">MyShop</Link>
      </div>

      <nav className={`header ${isMobileMenuOpen ? "is-open" : ""}`}>
        <Link href="/" onClick={closeMobileMenu}>
          Home
        </Link>
        <Link href="/products" onClick={closeMobileMenu}>
          Products
        </Link>
        <Link href="/categories" onClick={closeMobileMenu}>
          Categories
        </Link>
        <Link href="/search" onClick={closeMobileMenu}>
          <FaSearch /> <span className="mobile-text">Search</span>
        </Link>

        <Link href="/cart" onClick={closeMobileMenu}>
          <BsHandbag /> <span className="mobile-text">Cart</span>
        </Link>

        {user?._id ? (
          <div className="user-container" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              <FaUser /> <span className="mobile-text">Account</span>
            </button>

            {/* Conditional Dropdown Menu */}
            {isOpen && (
              <div className="dropdown-menu">
                {user.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => {
                      setIsOpen(false);
                      closeMobileMenu();
                    }}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/orders"
                  onClick={() => {
                    setIsOpen(false);
                    closeMobileMenu();
                  }}
                >
                  Orders
                </Link>
                <button onClick={logoutHandler}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" onClick={closeMobileMenu}>
            <FaSignInAlt /> <span className="mobile-text">Login</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
