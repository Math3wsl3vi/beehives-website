"use client"
import { useState } from "react";
import Reviews from "./Review";

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
            Reviews (24)
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "description" && (
        <div className="py-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h3>
          <div className="prose prose-yellow max-w-none text-gray-700">
            <p>
              Our premium beehive is crafted from sustainably sourced cedar wood, known for its natural resistance to rot and insects...
            </p>
            {/* Add more paragraphs here */}
          </div>
        </div>
      )}

      {activeTab === "specs" && (
        <div className="py-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Specifications</h3>
          <div className="prose prose-yellow max-w-none text-gray-700">
            <p>
              Our premium beehive is crafted from sustainably sourced cedar wood, known for its natural resistance to rot and insects...
            </p>
            {/* Add more paragraphs here */}
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
