"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { collection, Timestamp, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { Search } from "lucide-react";

type Order = {
  id: string;
  userEmail: string;
  userId: string;
  phoneNumber: string;
  totalAmount: number;
  status: "pending" | "completed" | "shipped";
  createdAt: Timestamp;
  receiptUrl: string;
  orderID: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    category?: string;
  }[];
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const ordersPerPage = 15;

  useEffect(() => {
    const ordersRef = collection(db, "orders");

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const updatedOrders: Order[] = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          userEmail: doc.data().userEmail || "N/A",
          userId: doc.data().userId || "N/A",
          phoneNumber: doc.data().phoneNumber || "N/A",
          totalAmount: doc.data().totalAmount || 0,
          status: doc.data().status || "pending",
          createdAt: doc.data().createdAt || Timestamp.now(),
          receiptUrl: doc.data().receiptUrl || "",
          orderID: doc.data().orderID || "N/A",
          items: doc.data().items || [],
        }))
        .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

      setOrders(updatedOrders);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: "pending" | "completed" | "shipped") => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Filter and search logic
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.orderID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-poppins">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders Dashboard</h1>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search by Order ID, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
            aria-label="Search orders"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="shipped">Shipped</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-100 text-gray-900">
              <th className="border-b p-4 text-left">Order ID</th>
              <th className="border-b p-4 text-left">Customer</th>
              <th className="border-b p-4 text-left">Products</th>
              <th className="border-b p-4 text-left">Total</th>
              <th className="border-b p-4 text-left">Date</th>
              <th className="border-b p-4 text-left">Status</th>
              <th className="border-b p-4 text-left">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border-b p-4">{order.orderID}</td>
                <td className="border-b p-4">
                  <div>{order.userEmail}</div>
                  <div className="text-sm text-gray-500">{order.phoneNumber}</div>
                </td>
                <td className="border-b p-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      {item.productName} x{item.quantity} (Ksh {item.price.toFixed(2)})
                    </div>
                  ))}
                </td>
                <td className="border-b p-4">Ksh {order.totalAmount.toFixed(2)}</td>
                <td className="border-b p-4">
                  {order.createdAt
                    ? new Date(order.createdAt.toDate()).toLocaleString()
                    : "N/A"}
                </td>
                <td className="border-b p-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as "pending" | "completed" | "shipped")
                    }
                    className={`p-1 rounded-md text-sm ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                    aria-label={`Update status for order ${order.orderID}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="shipped">Shipped</option>
                  </select>
                </td>
                <td className="border-b p-4">
                  {order.receiptUrl ? (
                    <a
                      href={order.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-600 hover:text-yellow-700"
                      aria-label={`Download receipt for order ${order.orderID}`}
                    >
                      Download
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="text-gray-900">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;