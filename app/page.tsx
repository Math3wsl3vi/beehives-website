"use client";
import { useEffect } from "react";
// import MenuSection from "@/components/foodSection/MenuSection";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
// import Reviews from "@/components/home/Review";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductsSection from "@/components/home/ProductsSection";
import ServicesSection from "@/components/home/ServicesSection";
import HoneySection from "@/components/home/HoneySection";
import InfoSection from "@/components/home/InfoSection";

export default function Home() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);


  return (
    <ProtectedRoute>
      <div className="flex flex-col relative h-screen w-full font-poppins">
        {/* navbar */}
        {/* main page */}
        <div>
          <Hero />
          <InfoSection/>
        </div>
        {/* breakfast */}
        {/* <MenuSection /> */}
        <ProductsSection/>
        <HoneySection/>
        <ServicesSection/>
        {/* lunch */}
        {/* dinner */}
        {/* bottom bar */}
        <div className="mt-10 p-4">
          {/* <Reviews /> */}
        </div>
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
