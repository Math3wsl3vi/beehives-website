import React from "react";
import { Button } from "@/components/ui/button"; 
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full px-6 pt-16 pb-24 text-center bg-gradient-to-b from-yellow-50 via-white to-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-yellow-700 font-poppins">
          Pure Honey & Beehives from Nature 🍯
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 font-poppins">
          Discover handcrafted beehives and 100% organic honey – delivered straight from our farms to your doorstep.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 text-lg font-medium shadow-md rounded-md">
            Shop Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" className="px-6 py-3 text-lg font-medium rounded-md border-yellow-500 text-yellow-600 hover:bg-yellow-50">
            Learn More
          </Button>
        </div>
      </div>

      {/* Optional Bee Image or Honeycomb background */}
      {/* You can place a background SVG or image here for aesthetics */}
      <div className="absolute top-4 left-4 opacity-10 pointer-events-none">
        {/* <img src="/assets/honeycomb.svg" alt="Honeycomb" /> */}
      </div>
    </section>
  );
};

export default Hero;
