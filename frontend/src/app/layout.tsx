// src/app/layout.tsx
import "@/styles/app.scss";
import Providers from '@/components/Providers'; 
import { ToasterProvider } from "@/components/ToasterProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
      <body className="layout">
        <Providers>
          <Header/>

          {/* THIS FIXES THE FOOTER ISSUE */}
          <main className="page-content">
            {children}
          </main>

          <Footer/>
        </Providers>

        <ToasterProvider />
      </body>
    </html>
  );
}