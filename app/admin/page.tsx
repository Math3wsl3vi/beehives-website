"use client";
import React from "react";
import Link from "next/link";

const AdminDashboard = () => {
  return (
    <div className="p-5 font-poppins">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Products */}
        <Link href="/admin/meals">
          <div className="border p-4 text-center cursor-pointer hover:shadow-lg transition">
            Manage Products
          </div>
        </Link>
        {/* Orders */}
        <Link href="/admin/orders">
          <div className="border p-4 text-center cursor-pointer hover:shadow-lg transition">
            {"Today's"} Orders
          </div>
        </Link>
        {/* Contact Inquiries (Optional) */}
        <Link href="/admin/contacts">
          <div className="border p-4 text-center cursor-pointer hover:shadow-lg transition">
            Contact Form Submissions
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
