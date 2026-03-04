// src/app/(private)/layout.tsx

import ProtectedRoute from "@/components/protected-route";


export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Standard user protection (no adminOnly flag needed)
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}