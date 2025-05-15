"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const gearItems = [
  {
    name: "Bee Suit",
    image: "/images/suit.jpg",
    description: "Protective gear that includes a veil, gloves, and full-body suit to prevent bee stings during hive inspection or harvesting.",
  },
  {
    name: "Bee Smoker",
    image: "/images/smoker.jpg",
    description: "Used to calm the bees by puffing cool smoke into the hive, making them less aggressive and easier to manage.",
  },
  {
    name: "Hive Tool",
    image: "/images/smoker.jpg",
    description: "A multipurpose tool used to pry apart hive boxes, scrape wax, and lift frames. Essential for any beekeeper.",
  },
  {
    name: "Hive",
    image: "/images/beehive2.jpeg",
    description: "A commonly used beehive structure consisting of stacked boxes that make honey harvesting and hive management easy.",
  },
  {
    name: "Honey Extractor",
    image: "/images/extract.jpg",
    description: "A mechanical device that spins honey out of the combs without destroying the comb, making harvesting efficient and clean.",
  },
  {
    name: "Bee Brush",
    image: "/images/smoker.jpg",
    description: "Soft brush used to gently remove bees from frames during inspection or honey harvesting without harming them.",
  },
];

const GearSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-yellow-700 mb-10">
        Beekeeping Gear & Equipment
      </h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Proper gear ensures safety, efficiency, and comfort during hive management and honey harvesting.{"Here's"} what we use and recommend for beekeepers of all levels.
      </p>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {gearItems.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-md overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={300}
              height={300}
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <div className="w-full mt-5">
              <Button className="bg-orange-1 w-full">Buy Now</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GearSection;
