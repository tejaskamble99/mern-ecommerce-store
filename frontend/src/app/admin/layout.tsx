"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedRoute from "@/components/protected-route";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute adminOnly={true}>
      <div className="admin-container">
        <AdminSidebar />
        {children}
      </div>
    </ProtectedRoute>
  );
}
