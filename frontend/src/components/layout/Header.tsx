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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import toast from "react-hot-toast";
import { CartReducerInitialState } from "@/types/reducer-types";

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { cartItems } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer,
  );

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
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const logoutHandler = async () => {
    try {
      setIsOpen(false);
      setIsMobileMenuOpen(false);
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Error logging out");
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="navbar">
      {/* Hamburger — mobile only */}
      <button
        className="hamburger-menu"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Brand — left */}
      <div className="navbar-brand">
        <Link href="/">
          <img src="/assets/logo/logo.png" alt="MyStore" />
        </Link>
      </div>

      {/* Center nav links — desktop */}
      <nav className={`header-nav ${isMobileMenuOpen ? "is-open" : ""}`}>
        <Link href="/search?category=connector">Connector</Link>
        <Link href="/search?category=charger">Charger</Link>
        <Link href="/search?category=bluetooth-headset">Bluetooth Headset</Link>
        <Link href="/search?category=tws">TWS</Link>
        <Link href="/search?category=power-bank">Power Bank</Link>
        <Link href="/search?category=hands-free">Hands-Free</Link>
      </nav>

      {/* Right actions — icons */}
      <div className="header-actions">
        <Link href="/search" onClick={closeMobileMenu}>
          <FaSearch />
        </Link>

        <Link href="/cart" onClick={closeMobileMenu}>
          <div className="cart-icon-wrapper">
            <BsHandbag />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </div>
          <span className="mobile-text">Cart</span>
        </Link>

        {isMounted && user?._id ? (
          <div className="user-container" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              <FaUser />
            </button>

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
            <FaSignInAlt />
            <span className="mobile-text">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
