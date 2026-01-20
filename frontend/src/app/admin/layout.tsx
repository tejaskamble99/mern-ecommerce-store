"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container">
      {/* Column 1: Sidebar */}
      <AdminSidebar />
      
      {/* Column 2: The Page Content (Dashboard, Products, etc.) */}
      {children}
    </div>
  );
}