"use client";

import Image from "next/image";
import React from "react";

const InfoSection = () => {
  return (
    <section className="bg-yellow-50 py-10 px-6 md:px-20 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-800 mb-4 text-center">
          Introduction to Beekeeping
        </h2>

        <p className="text-lg mb-6 text-center max-w-3xl mx-auto">
          At <strong>KMK Beehives</strong>, we believe in sustainable and profitable beekeeping. Whether {"you're"} just getting started or {"you're"} an experienced beekeeper looking to scale, our mission is to empower you with the tools, knowledge, and equipment you need.
        </p>

        <div className="flex flex-col gap-10 mt-10 items-start">
          {/* Column 1: Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-yellow-700">
              Beekeeping Strategies That Work
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Proper Hive Placement:</strong> Ensure hives are away from traffic and near flowering plants.
              </li>
              <li>
                <strong>Regular Hive Inspections:</strong> Monitor for pests, diseases, and queen health every 7–14 days.
              </li>
              <li>
                <strong>Seasonal Management:</strong> Adjust feeding, space, and shade depending on the time of year.
              </li>
              <li>
                <strong>Harvesting Without Harm:</strong> Use smoke and proper timing to collect honey while keeping bees safe.
              </li>
              <li>
                <strong>Record Keeping:</strong> Document hive conditions, honey yields, and interventions for better management.
              </li>
            </ul>
          </div>
          <div>
            <Image
            src='/images/hive1.jpg'
            alt="honey"
            width={400}
            height={400}
            className="w-full rounded-md"
            />
          </div>
          </div>

          {/* Column 2: Video Section */}
          <div className="w-full">
            <h3 className="text-2xl font-semibold mb-2 text-yellow-700">
              Watch: Basics of Beekeeping
            </h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-full rounded-lg shadow-md"
                src="https://www.youtube.com/watch?v=jeFxOUZreXI&t=575s"
                title="Beekeeping Basics"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
