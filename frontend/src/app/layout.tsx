import "@/styles/app.scss";
import Providers from '@/components/Providers'; 
import { ToasterProvider } from "@/components/ToasterProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";


export const metadata = {
  title: 'Barwa | Next-Gen Electronics',
  description: 'Premium electronics and accessories store.',
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


          <main className="page-content">
            {children}
          </main>

          <Footer/>
        </Providers>

        <ToasterProvider />


        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}