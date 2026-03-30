import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { AiFillFileText } from "react-icons/ai";
import { BiSolidDashboard } from "react-icons/bi";
import { FaAddressCard, FaBars, FaTimes } from "react-icons/fa";

const ProfileSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
      <button
        className="profile-hamburger"
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {isOpen && <div className="profile-sidebar-overlay" onClick={close} />}
      <aside className={`user-sidebar ${isOpen ? "open" : ""}`}>
        <div>
          <h5>My Account</h5>
          <ul>
            <Li
              url="/dashboard"
              text="Dashboard"
              Icon={BiSolidDashboard}
              location={pathname}
              close={close}
            />
            <Li
              url="/dashboard/address"
              text="Address"
              Icon={FaAddressCard}
              location={pathname}
            />
            <Li
              url="/dashboard/orders"
              text="Orders"
              Icon={AiFillFileText}
              location={pathname}
            />
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
  close?: () => void;
}

const Li = ({ url, text, location, Icon, close }: LiProps) => (
  <li
    style={{
      backgroundColor: location === url ? "rgba(0,104,136,0.1)" : "white",
    }}
  >
    <Link
      href={url}
      onClick={close}
      style={{
        color: location === url ? "rgb(0,104,136)" : "black",
      }}
    >
      <Icon />
      {text}
    </Link>
  </li>
);

export default ProfileSidebar;
