// src/app/(root)/layout.tsx
"use client"; 
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