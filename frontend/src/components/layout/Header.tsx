"use client";
import Link from "next/link";
import { useState } from "react";
import { BsHandbag } from "react-icons/bs";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-[var(--custom-dark)]  backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-tr from-indigo-600 to-blue-400 flex items-center justify-center text-white font-bold">
                N
              </div>
              <span className="font-semibold text-lg">Tejas Kamble</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-300 hover:text-custom-blue transition-colors"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-gray-300 hover:text-custom-blue transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="ttext-sm font-medium text-gray-300 hover:text-custom-blue transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="ttext-sm font-medium text-gray-300 hover:text-custom-blue transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right side: Search (tablet+), cart, mobile menu */}
          <div className="flex items-center gap-3">
            {/* Search: shown on md+ */}
            <div className="hidden md:block">
              <label htmlFor="search" className="sr-only">
                Search products
              </label>
              <div className="relative">
                <input
                  id="search"
                  name="search"
                  type="search"
                  placeholder="Search products..."
                  className="w-64 px-3 py-2 border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <svg
                  className="w-4 h-4 absolute right-3 top-2.5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Cart button (placeholder) */}
            <Link
              href="/cart"
              className="relative inline-flex items-center p-2 rounded-md hover:bg-gray-100"
            >
              <BsHandbag className="w-6 h-6 text-gray-700" />
              {/* badge */}
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded">
                0
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? (
                <svg
                  className="w-6 h-6 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden bg-white border-t ${open ? "block" : "hidden"}`}
      >
        <div className="px-4 py-3 space-y-2">
          <Link href="/products" className="block text-gray-700 font-medium hover:text-custom-blue transition-colors">
            Products
          </Link>
          <Link href="/categories" className="block text-gray-700 font-medium hover:text-custom-blue transition-colors">
            Categories
          </Link>
          <Link href="/about" className="block text-gray-700 font-medium hover:text-custom-blue transition-colors">
            About
          </Link>
          <Link href="/contact" className="block text-gray-700 font-medium hover:text-custom-blue transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
