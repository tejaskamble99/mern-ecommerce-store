// src/app/layout.tsx
import "@/styles/app.scss";
import Providers from '@/components/Providers'; // Assuming this wraps Redux/Session
import { ToasterProvider } from "@/components/ToasterProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// This ONLY works because we removed "use client"
export const metadata = {
  title: 'MyStore',
  description: 'MERN Stack Ecommerce Store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* ADD suppressHydrationWarning={true} HERE */}
      <body 
        className="min-h-screen flex flex-col font-sans"
        suppressHydrationWarning={true} 
      >
        <Providers>
          <Header/>
          {children}
          <Footer/>
        </Providers>
       <ToasterProvider />
      </body>
    </html>
  );
}