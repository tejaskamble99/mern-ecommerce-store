"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { AiFillFileText } from "react-icons/ai";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaGamepad,
  FaImage,
  FaStopwatch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { RiCoupon3Fill, RiDashboardFill, RiShoppingBag3Fill } from "react-icons/ri";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        className="admin-hamburger"
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay — mobile only */}
      {isOpen && (
        <div className="admin-sidebar-overlay" onClick={close} />
      )}

      <aside className={`admin-sidebar ${isOpen ? "is-open" : ""}`}>
        <h2>LOGO.</h2>

        {/* 1. DASHBOARD SECTION */}
        <div>
          <h5>Dashboard</h5>
          <ul>
            <Li url="/admin/dashboard" text="Dashboard" Icon={RiDashboardFill} location={pathname} />
            <Li url="/admin/product" text="Product" Icon={RiShoppingBag3Fill} location={pathname} />
            <Li url="/admin/customer" text="Customer" Icon={IoIosPeople} location={pathname} />
            <Li url="/admin/transaction" text="Transaction" Icon={AiFillFileText} location={pathname} />
            <Li url="/admin/banners" text="Banners" Icon={FaImage} location={pathname} />
          </ul>
        </div>

        {/* 2. CHARTS SECTION */}
        <div>
          <h5>Charts</h5>
          <ul>
            <Li url="/admin/chart/bar" text="Bar" Icon={FaChartBar} location={pathname} />
            <Li url="/admin/chart/pie" text="Pie" Icon={FaChartPie} location={pathname} />
            <Li url="/admin/chart/line" text="Line" Icon={FaChartLine} location={pathname} />
          </ul>
        </div>

        {/* 3. APPS SECTION */}
        <div>
          <h5>Apps</h5>
          <ul>
            <Li url="/admin/app/coupon" text="Coupon" Icon={RiCoupon3Fill} location={pathname} />
            <Li url="/admin/app/toss" text="Toss" Icon={FaGamepad} location={pathname} />
            <Li url="/admin/app/stopwatch" text="Stopwatch" Icon={FaStopwatch} location={pathname} />
          </ul>
        </div>
      </aside>
    </>
  );
};

interface LiProps {
  url: string;
  text: string;
  location: string;
  Icon: IconType;
}

const Li = ({ url, text, location, Icon }: LiProps) => (
  <li
    style={{
      backgroundColor: location.includes(url) ? "rgba(0,115,255,0.1)" : "white",
    }}
  >
    <Link
      href={url}
      style={{
        color: location.includes(url) ? "rgb(0,115,255)" : "black",
      }}
    >
      <Icon />
      {text}
    </Link>
  </li>
);

export default AdminSidebar;