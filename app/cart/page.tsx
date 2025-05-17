"use client";

import React, { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import Image from "next/image";
import { db } from "@/configs/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import JsBarcode from "jsbarcode";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [polling, setPolling] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const { user } = useAuth();
  const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  const startPolling = (checkoutRequestID: string) => {
    if (polling) return;
    setPolling(true);

    let retries = 0;
    const maxRetries = 10;
    let orderSaved = false;

    const interval = setInterval(async () => {
      if (retries >= maxRetries) {
        clearInterval(interval);
        setPolling(false);
        toast({ description: "Payment verification timed out. Try again." });
        return;
      }

      try {
        const response = await fetch("/api/mpesa/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutRequestID }),
        });

        const data = await response.json();

        if (data.status === "COMPLETED") {
          clearInterval(interval);
          setPolling(false);
          setIsPaymentSuccessful(true);

          if (!orderSaved) {
            orderSaved = true;
            await saveOrderToFirestore();
          }
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setPolling(false);
          setIsPaymentSuccessful(false);
          toast({ description: "Payment failed. Please try again." });
        }
      } catch (error) {
        console.error("Polling error:", error);
      }

      retries++;
    }, 5000);
  };

  const saveOrderToFirestore = async () => {
    if (cart.length === 0) {
      toast({ description: "Cart is empty. Please try again." });
      return;
    }

    const orderID = `ORD-${Date.now()}`;
    const storage = getStorage();
    const storageRef = ref(storage, `receipts/${orderID}.pdf`);

    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, orderID, { format: "CODE128" });
    const barcodeData = canvas.toDataURL("image/png");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("KMK Beehives Receipt", 105, 20, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.rect(18, 30, 174, 40);
    doc.text(`Date:`, 22, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`${date}`, 50, 40);

    doc.setFont("helvetica", "bold");
    doc.text(`Order ID:`, 22, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${orderID}`, 50, 50);

    doc.setFont("helvetica", "bold");
    doc.text(`Phone Number:`, 22, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${phoneNumber}`, 60, 60);

    doc.setFont("helvetica", "bold");
    doc.text("Product Details:", 22, 80);
    doc.setFont("helvetica", "normal");

    cart.forEach((item, index) => {
      const yOffset = 90 + index * 10;
      doc.text(
        `${index + 1}. ${item.name} x${item.quantity} - Ksh ${parseFloat(item.price) * item.quantity}`,
        22,
        yOffset
      );
    });

    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: Ksh ${totalAmount}`, 22, 90 + cart.length * 10);
    doc.setLineWidth(0.3);
    doc.line(20, 95 + cart.length * 10, 190, 95 + cart.length * 10);

    doc.addImage(barcodeData, "PNG", 55, 100 + cart.length * 10, 100, 30);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Thank you for choosing KMK Beehives!", 105, 140 + cart.length * 10, { align: "center" });

    const pdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" });

    try {
      await uploadBytes(storageRef, pdfBlob);
      const receiptUrl = await getDownloadURL(storageRef);

      const orderData = {
        userEmail: user?.email || "Unknown User",
        userId: user?.uid || "N/A",
        phoneNumber,
        totalAmount,
        status: "completed",
        createdAt: serverTimestamp(),
        orderID,
        receiptUrl,
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
        })),
      };

      await addDoc(collection(db, "orders"), orderData);
      toast({ description: "Order and receipt saved successfully!" });

      setTimeout(() => {
        setIsPaymentSuccessful(false);
        clearCart();
      }, 20000);
    } catch (error) {
      console.error("Error saving order or receipt:", error);
      toast({ description: "Failed to save order. Please contact support." });
    }
  };

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast({ description: "Please enter your phone number." });
      return;
    }

    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith("07") || formattedPhone.startsWith("01")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    }
    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      toast({ description: "Invalid phone number format." });
      return;
    }

    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone, amount: totalAmount }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({ description: "Payment initiated. Waiting for confirmation..." });
        startPolling(data.CheckoutRequestID);
      } else {
        toast({ description: "Failed to initiate payment." });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({ description: "Something went wrong. Try again." });
    }
  };

  const downloadReceipt = () => {
    if (cart.length === 0) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    const orderID = `ORD-${Date.now()}`;

    const canvas = document.createElement("canvas");
    JsBarcode(canvas, orderID, { format: "CODE128" });
    const barcodeData = canvas.toDataURL("image/png");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("KMK Beehives Receipt", 105, 20, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.rect(18, 30, 174, 40);
    doc.text(`Date:`, 22, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`${date}`, 50, 40);

    doc.setFont("helvetica", "bold");
    doc.text(`Order ID:`, 22, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${orderID}`, 50, 50);

    doc.setFont("helvetica", "bold");
    doc.text(`Phone Number:`, 22, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${phoneNumber}`, 60, 60);

    doc.setFont("helvetica", "bold");
    doc.text("Product Details:", 22, 80);
    doc.setFont("helvetica", "normal");

    cart.forEach((item, index) => {
      const yOffset = 90 + index * 10;
      doc.text(
        `${index + 1}. ${item.name} x${item.quantity} - Ksh ${parseFloat(item.price) * item.quantity}`,
        22,
        yOffset
      );
    });

    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: Ksh ${totalAmount}`, 22, 90 + cart.length * 10);
    doc.setLineWidth(0.3);
    doc.line(20, 95 + cart.length * 10, 190, 95 + cart.length * 10);

    doc.addImage(barcodeData, "PNG", 55, 100 + cart.length * 10, 100, 30);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Thank you for choosing KMK Beehives!", 105, 140 + cart.length * 10, { align: "center" });

    doc.save(`Receipt_${orderID}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-poppins">
      {cart.length === 0 ? (
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <div className="flex justify-center items-center mb-6">
            <Image
              src="/images/emptycartnew.png"
              alt="Empty cart"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
          <Link
            href="/"
            className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Shop Now
          </Link>
        </section>
      ) : (
        <section className="space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <div className="space-y-4">
            {cart.map((item) => (
              <article
                key={item.id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={item.imageUrl || "/images/placeholder.jpg"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">
                    Ksh {parseFloat(item.price).toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                    aria-label={`Decrease quantity of ${item.name}`}
                    disabled={isPaymentSuccessful}
                  >
                    −
                  </button>
                  <span className="px-4 py-1 text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                    aria-label={`Increase quantity of ${item.name}`}
                    disabled={isPaymentSuccessful}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-600 font-medium"
                  aria-label={`Remove ${item.name} from cart`}
                  disabled={isPaymentSuccessful}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Ksh {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>Ksh {totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter phone number (07XXXXXXXX or 01XXXXXXXX)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`w-full p-3 mt-4 border rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent ${
                phoneNumber && !/^254(7|1)\d{8}$/.test(phoneNumber.replace(/^0/, "254"))
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              aria-required="true"
              disabled={isPaymentSuccessful}
            />
            {isPaymentSuccessful ? (
              <div className="mt-4">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-2 text-lg font-semibold text-green-600">
                    Payment Successful!
                  </span>
                </div>
                <button
                  onClick={downloadReceipt}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
                  aria-label="Download purchase receipt"
                >
                  Download Receipt
                </button>
                <Link
                  href="/"
                  className="w-full mt-4 inline-block bg-orange-1 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors text-center"
                >
                  Shop More
                </Link>
              </div>
            ) : (
              <button
                onClick={handlePayment}
                className="w-full mt-4 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={polling}
                aria-label="Confirm payment and proceed"
              >
                {polling ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Confirm & Pay"
                )}
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default CartPage;