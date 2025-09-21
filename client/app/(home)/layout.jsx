

import "../globals.css";

import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import ClientProvider from "../components/ClientProvider";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "BabyGlam - Baby Products, Toys & Beauty",
  description: "Shop Baby Products, Toys, and Beauty essentials at BabyGlam. Quality, affordable, and stylish items for babies and women.",
  keywords: "baby products, toys, women beauty, ecommerce, BabyGlam", // SEO keywords
  openGraph: {
    title: "BabyGlam - Baby Products, Toys & Beauty",
    description: "Your one-stop shop for baby essentials, toys, and women's beauty products.",
    url: "https://babyglam.com",
    siteName: "BabyGlam",
    images: [
      {
        url: "/assets/BabyGlam-og.png",
        width: 1200,
        height: 630,
        alt: "BabyGlam Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
            <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <ClientProvider >
          
          <Header />
          <main className="flex-grow">{children}</main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
