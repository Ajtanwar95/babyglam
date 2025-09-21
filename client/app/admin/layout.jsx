import "../globals.css";

import ClientProvider from "../components/ClientProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "../components/Admin/AppSideBar";
import Footer from "../components/Footer/Footer";
import Topbar from "../components/Admin/Topbar";
import ThemeProvider from "../components/Admin/ThemeProvider";

export const metadata = {
  title: "BabyGlam - Baby Products, Toys & Beauty",
  description:
    "Shop Baby Products, Toys, and Beauty essentials at BabyGlam. Quality, affordable, and stylish items for babies and women.",
  keywords: "baby products, toys, women beauty, ecommerce, BabyGlam", // SEO keywords
  openGraph: {
    title: "BabyGlam - Baby Products, Toys & Beauty",
    description:
      "Your one-stop shop for baby essentials, toys, and women's beauty products.",
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

export default function adminLayout({ children }) {
  return (
    <html lang="en">
      <body className="  ">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
        <SidebarProvider>
          <ClientProvider>
            <AppSideBar />

            <main className=" pt-[70px]  md:w-[calc(100vw-16rem)]">
              <Topbar/>
              <div className=" px-5 min-h-screen">
                {children}
                </div>
              <div>
                <Footer />
              </div>
            </main>
          </ClientProvider>
        </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
