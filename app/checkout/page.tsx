"use client";

import React, { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";

const CheckoutPage = () => {
  const { cart, clearCart } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [polling, setPolling] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const totalAmount = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);

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

    if (!user) {
      toast({ description: "Please log in to complete the purchase." });
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

    doc.text(`Order ID:`, 22, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${orderID}`, 50, 50);

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
        userEmail: user.email || "Unknown User",
        userId: user.uid || "N/A",
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
        router.push("/");
      }, 5000);
    } catch (error) {
      console.error("Error saving order or receipt:", error);
      toast({ description: "Failed to save order. Please contact support." });
    }
  };

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast({ description: "Please enter a valid phone number." });
      return;
    }

    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith("07") || formattedPhone.startsWith("01")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    }
    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      toast({ description: "Invalid phone number format. Use 07XXXXXXXX or 01XXXXXXXX." });
      return;
    }

    if (!user) {
      toast({ description: "Please log in to complete the purchase." });
      router.push("/login");
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

    doc.text(`Order ID:`, 22, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${orderID}`, 50, 50);

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
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="mb-5">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            {cart.map((item) => (
              <div key={item.id} className="flex justify      justify-between border-b py-2">
                <span>{item.name} x {item.quantity}</span>
                <span>Ksh {parseFloat(item.price) * item.quantity}</span>
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder="Enter phone number (07XXXXXXXX or 01XXXXXXXX)"
            className="w-full p-2 border rounded mb-4"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <p className="font-bold mb-4">
            Total: Ksh {totalAmount}
          </p>

          <button
            className="bg-orange-500 text-white p-2 w-full rounded disabled:opacity-50"
            onClick={handlePayment}
            disabled={polling}
          >
            {polling ? "Processing..." : "Pay Now"}
          </button>

          {isPaymentSuccessful && (
            <button
              className="mt-4 bg-green-500 text-white p-2 w-full rounded"
              onClick={downloadReceipt}
            >
              Download Receipt
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CheckoutPage;