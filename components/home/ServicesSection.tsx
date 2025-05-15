"use client";

import React from "react";
import { Button } from "../ui/button";

const Services = () => {
  const services = [
    {
      title: "Hive Installation",
      description:
        "We offer professional hive installation services to ensure your beehives are set up in the best location for optimal productivity and safety. Whether it’s a Langstroth, Kenyan Top Bar, or custom hive, our experts handle everything from transport to final positioning.",
      icon: "🍯",
    },
    {
      title: "Honey Harvesting",
      description:
        "Our team provides clean and efficient honey harvesting using safe, non-invasive methods that preserve colony health and maximize yield. We also offer filtering, packaging, and labeling support for your honey products.",
      icon: "🐝",
    },
    {
      title: "Bee Colony Transfer",
      description:
        "Need to move your bees into a new hive? We safely transfer colonies between hives or from natural habitats into managed hives while protecting both bees and handlers.",
      icon: "🔄",
    },
    {
      title: "Hive Inspection & Maintenance",
      description:
        "We conduct regular hive inspections to monitor colony health, check for pests or diseases, and perform maintenance like cleaning, repairing, or re-waxing frames. Our goal is to keep your bees thriving all year round.",
      icon: "🔍",
    },
    {
      title: "Beekeeping Training & Consultation",
      description:
        "New to beekeeping? We offer hands-on training, workshops, and personalized consultations to get you started and guide you through every stage of your beekeeping journey.",
      icon: "📚",
    },
    {
      title: "Bee Removal (Ethical Relocation)",
      description:
        "If you have a wild bee colony on your property, we offer ethical and eco-friendly bee removal services to relocate them safely to a managed hive environment.",
      icon: "🚚",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-4 p-6">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">Our Services</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="text-4xl mb-2">{service.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="text-gray-700">{service.description}</p>
           <div className="flex justify-end mt-5">
           <Button className="bg-orange-1">Learn More</Button>
           </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
