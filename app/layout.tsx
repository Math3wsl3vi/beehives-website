import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/home/Navbar";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/home/Footer";


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
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
