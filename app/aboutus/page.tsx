"use client";

import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4 font-pop">About KMK Beehives</h1>
      <p className="text-gray-700 mb-4 font-pop">
        KMK Beehives is your trusted partner in modern beekeeping. We specialize in crafting durable, high-quality beehives and offering raw, organic honey harvested with care. Whether {"you're"} a beginner or a seasoned apiarist, our products are designed to help you succeed in sustainable beekeeping.
      </p>

      <h2 className="text-xl font-semibold mt-4 font-pop">Our Mission</h2>
      <p className="text-gray-700 font-pop">
        Our mission is to empower individuals and communities through sustainable beekeeping. We aim to promote environmental conservation while helping farmers and entrepreneurs benefit from the sweet rewards of bees.
      </p>

      <h2 className="text-xl font-semibold mt-4 font-pop">Why Choose KMK Beehives?</h2>
      <ul className="list-disc list-inside text-gray-700 font-pop">
        <li>🐝 Handcrafted Langstroth and Top Bar hives</li>
        <li>🍯 100% natural, unprocessed honey</li>
        <li>📦 Countrywide delivery within 2–5 days</li>
        <li>📘 Beginner-friendly guides and expert support</li>
        <li>🌍 Commitment to sustainability and pollinator health</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 font-pop">Our Team</h2>
      <p className="text-gray-700 font-pop">
        KMK Beehives is led by a passionate team of beekeepers, carpenters, and eco-advocates. We believe in making beekeeping accessible to everyone — from hobbyists to commercial farmers — while protecting {"nature's"} most important pollinators.
      </p>

      <h2 className="text-xl font-semibold mt-4 font-pop">Contact Us</h2>
      <p className="text-gray-700 font-pop">
        {"We'd"} love to hear from you! For orders, consultations, or partnership inquiries:
      </p>
      <p className="text-gray-700 font-pop">
        📧 <strong>Email:</strong> support@kmkbeehives.com <br />
        📞 <strong>Phone:</strong> <a href="tel:+2547721949615" className="text-yellow-700">0721949615</a><br />
        📍 <strong>Location:</strong> Eldama Ravine, Baringo
      </p>
    </div>
  );
};

export default About;
