import React from "react";
import { Button } from "@/components/ui/button"; // Optional - for CTA buttons
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Asali 1",
    price: "Ksh 4,500",
    image: "/images/honey1.jpg",
  },
  {
    id: 2,
    name: "Asali 2",
    price: "Ksh 5,000",
    image: "/images/honey2.jpg",
  },
];

const HoneySection = () => {
  return (
    <section className="px-6 py-16 bg-white font-poppinspins">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-yellow-700 mb-4 font-poppins">Our Honey</h2>
        <p className="text-gray-600 mb-12 text-lg">
          Explore our premium selection pure natural honey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-md overflow-hidden shadow hover:shadow-lg transition duration-300"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="h-52 w-full object-cover"
              />
              <div className="p-4 text-left">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-yellow-600 font-medium mt-1">{product.price}</p>
                <Button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HoneySection;
