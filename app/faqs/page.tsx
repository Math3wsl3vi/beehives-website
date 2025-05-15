"use client";

import React from "react";

const FAQs = () => {
  const faqData = [
    {
      question: "What types of beehives do you sell?",
      answer:
        "We sell Langstroth and Top Bar hives — both ideal for small-scale and commercial beekeeping. Each hive is handcrafted for durability and maximum honey production.",
    },
    {
      question: "Do you offer guidance for beginners?",
      answer:
        "Yes! We provide a free starter guide with every hive purchase. You can also book a consultation with our experts to get started in beekeeping.",
    },
    {
      question: "How do I order a beehive or honey?",
      answer:
        "Simply browse our products, add them to your cart, and proceed to checkout. You can pay via M-Pesa, bank transfer, or card.",
    },
    {
      question: "Do you deliver beehives nationwide?",
      answer:
        "Absolutely. We deliver across Kenya within 2–5 business days. Delivery fees vary depending on your location and order size.",
    },
    {
      question: "Can bees be included with the hive?",
      answer:
        "Due to transport regulations, we do not ship live bees. However, we can connect you with local apiaries for bee colonies in your area.",
    },
    {
      question: "How do I contact you for support?",
      answer:
        "You can email us at support@kmkbeehives.com or call our customer service line for immediate help.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6 font-pop">
        Frequently Asked Questions
      </h1>
      {faqData.map((faq, index) => (
        <div key={index} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-800">{faq.question}</h2>
          <p className="text-gray-700 mt-2">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQs;
