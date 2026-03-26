"use client";

import ProfileSidebar from "@/components/dashboard/ProfileSidebar";
import ProtectedRoute from "@/components/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="profile-container">
        <ProfileSidebar />
        {children}
      </div>
    </ProtectedRoute>
  );
}