"use client";
import Link from "next/link";
import { useState } from "react";
import { BsHandbag } from "react-icons/bs";
import { FaSearch, FaSignOutAlt, FaUser , FaSignInAlt } from "react-icons/fa";

const user = { _id: "tejas", role: "admin" };

export default function Header() {
  const [isOpen , setIsOpen] = useState(false);

  const logoutHandler = () =>{
    setIsOpen(false);
    console.log("logout...");
  }
  return (
    <div className="navbar">
    <nav className="header">
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/categories">Categorie</Link>
      <Link href="/search">
        <FaSearch />
      </Link>

      <Link href="/cart">
        <BsHandbag />
      </Link>
      {user?._id ? (
          <div className="user-container">
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <FaUser />
            </button>
            
            {/* The Dropdown Menu */}
            <dialog open={isOpen}>
              <div>
                {user.role === "admin" && (
                  <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                    Admin
                  </Link>
                )}
                <Link href="/orders" onClick={() => setIsOpen(false)}>
                  Orders
                </Link>
                <button onClick={logoutHandler}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </dialog>
          </div>
      ) : (
        <Link href="/login">
          <FaSignInAlt />
        </Link>
      )}
    </nav>
    </div>
  );
}
