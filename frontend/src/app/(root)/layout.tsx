// src/app/(root)/layout.tsx
"use client"; // This is required for Header/Footer interaction

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';


export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header/>
      <main className="">
        {children}
      </main>
      {/* <Footer /> */}
    </>
  );
}