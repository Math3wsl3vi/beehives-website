"use client";
import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductsSection from "@/components/home/ProductsSection";
import ServicesSection from "@/components/home/ServicesSection";
import HoneySection from "@/components/home/HoneySection";
import InfoSection from "@/components/home/InfoSection";
import ContactForm from "@/components/home/ContactForm";
import GearSection from "@/components/home/GearSection";
import Footer from "@/components/home/Footer";

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
        <ProductsSection/>
        <HoneySection/>
        <GearSection/>
        <ServicesSection/>
        {/* lunch */}
        {/* dinner */}
        {/* bottom bar */}
        <div className="mt-10">
          {/* <Reviews /> */}
          <ContactForm/>
        </div>
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
