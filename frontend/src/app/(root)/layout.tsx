// src/app/(root)/layout.tsx
"use client"; // This is required for Header/Footer interaction
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      
      <main className="">
        {children}
      </main>
     
    </>
  );
}