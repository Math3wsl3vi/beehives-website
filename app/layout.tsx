import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/home/Navbar";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";


export const metadata: Metadata = {
  title: "KMK Beehives",
  description: "Quality Beehives",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <AuthProvider>
        <div>
          <Navbar/>
        </div>
        <Toaster/>
        {children}
        {/* <div className="fixed bottom-0 w-full mt-20">
        <Footer/>
      </div> */}
      </AuthProvider>
      </body>
    </html>
  );
}
