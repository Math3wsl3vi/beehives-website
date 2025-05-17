"use client"
import { useState } from "react";
import Reviews from "./Review";
import { Frame, Hammer, House, Paintbrush, Scale, TableProperties } from "lucide-react";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-16">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-1 py-4 text-sm font-medium ${
              activeTab === "description"
                ? "border-b-2 border-yellow-500 text-yellow-600"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-1 py-4 text-sm font-medium ${
              activeTab === "specs"
                ? "border-b-2 border-yellow-500 text-yellow-600"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-1 py-4 text-sm font-medium ${
              activeTab === "reviews"
                ? "border-b-2 border-yellow-500 text-yellow-600"
                : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Reviews 
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "description" && (
        <div className="py-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Product Details
          </h3>
          <div className="prose prose-yellow max-w-none text-gray-700 flex flex-col gap-4">
          <div className="flex gap-2">
            <Hammer className="text-green-500"/>
          <p>
              Body: Made from treated and painted timber, ensuring long-lasting durability and protection against
              pests and weather.
            </p>

          </div>
          <div className="flex gap-2">
            <Frame className="text-green-500"/>
          <p>
          Frames: Typically comes with 10–20 removable frames for easy honey harvesting and inspection.
            </p>

          </div>

          <div className="flex gap-2">
            <House className="text-green-500"/>
          <p>
          Roof: Corrugated metal or iron sheet cover, providing excellent rain and sun protection.
            </p>

          </div>
          <div className="flex gap-2">
            <Paintbrush className="text-green-500"/>
          <p>
          Color: Bright yellow paint helps in weatherproofing and easy visibility for bees.
            </p>
          </div>
          </div>
        </div>
      )}

      {activeTab === "specs" && (
        <div className="py-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Product Specifications
          </h3>
          <div className="prose prose-yellow max-w-none text-gray-700 flex flex-col gap-4">
          <div className="flex gap-2">
            <TableProperties className="text-green-500"/>
          <p>
          Standard Size: Approx.{' 22"'} L x {'16"'} W x {'14"'} H 
            </p>

          </div>
          <div className="flex gap-2">
            <Scale className="text-green-500"/>
          <p>
          Weight: ~5–10 kg depending on included parts.
            </p>

          </div>

          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="py-8">
          <Reviews />
        </div>
      )}
    </div>
  );
}
