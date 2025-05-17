"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store/cartStore";
import { db, storage } from "@/configs/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { Product } from "@/types/product";

interface ProductPurchaseOptionsProps {
  product: Product;
}

const ProductPurchaseOptions: React.FC<ProductPurchaseOptionsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [polling, setPolling] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCartStore(); // Removed unused 'cart'

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price, // Keep as string to match Product type
      quantity,
      imageUrl: product.imageUrl,
      category: product.category,
      desc: product.desc,
    });
    toast({ description: `${product.name} added to cart!` });
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({ description: "Please log in to proceed with checkout." });
      return;
    }
    setIsCheckoutOpen(true);
    setIsPaymentSuccessful(false);
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
      toast({
        description: "Invalid phone number. Use format 07XXXXXXXX or 01XXXXXXXX.",
      });
      return;
    }

    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: parseFloat(product.price) * quantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({ description: "Payment initiated. Waiting for confirmation..." });
        setPolling(true);
        startPolling(data.CheckoutRequestID, product.id);
      } else {
        toast({ description: "Failed to initiate payment." });
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({ description: "Something went wrong. Please try again." });
    }
  };

  const startPolling = (checkoutRequestID: string, productId: string) => {
    if (polling) return;
    setPolling(true);

    const interval = setInterval(async () => {
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

          try {
            const orderID = `ORD-${Date.now()}`;

            const orderRef = await addDoc(collection(db, "orders"), {
              userEmail: user?.email || "Unknown User",
              userId: user?.uid || "N/A",
              phoneNumber,
              totalAmount: parseFloat(product.price) * quantity,
              status: "completed",
              createdAt: serverTimestamp(),
              orderID,
              items: [
                {
                  productId: product.id,
                  productName: product.name,
                  price: parseFloat(product.price),
                  quantity,
                },
              ],
            });

            const receiptUrl = await generateAndUploadReceipt({
              orderId: orderID,
              productName: product.name,
              price: parseFloat(product.price) * quantity,
              quantity,
              phoneNumber,
            });

            await updateDoc(orderRef, { receiptUrl });

            const productRef = doc(db, "products", productId);
            await runTransaction(db, async (transaction) => {
              const productDoc = await transaction.get(productRef);
              if (!productDoc.exists()) throw new Error("Product does not exist!");

              const newQuantity = parseInt(productDoc.data().quantity) - quantity;
              if (newQuantity < 0) throw new Error("Not enough stock available!");

              transaction.update(productRef, { quantity: newQuantity.toString() });
            });

            toast({ description: "Payment confirmed! Order placed successfully." });
          } catch (error) {
            console.error("Error updating product quantity:", error);
            toast({ description: "Failed to update product stock. Please contact support." });
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
    }, 5000);
  };

  const generateAndUploadReceipt = async ({
    orderId,
    productName,
    price,
    quantity,
    phoneNumber,
  }: {
    orderId: string;
    productName: string;
    price: number;
    quantity: number;
    phoneNumber: string;
  }) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    const canvas = document.createElement("canvas");
    JsBarcode(canvas, orderId, { format: "CODE128" });
    const barcodeData = canvas.toDataURL("image/png");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("KMK Beehives Receipt", 105, 20, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Date:`, 22, 40);
    doc.setFont("helvetica", "normal");
    doc.text(`${date}`, 50, 40);

    doc.setFont("helvetica", "bold");
    doc.text(`Order ID:`, 22, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${orderId}`, 50, 50);

    doc.setFont("helvetica", "bold");
    doc.text(`Phone Number:`, 22, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${phoneNumber}`, 60, 60);

    doc.setFont("helvetica", "bold");
    doc.text("Product Details:", 22, 80);
    doc.setFont("helvetica", "normal");
    doc.text(`${productName} x${quantity} - Ksh ${price}`, 22, 90);

    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: Ksh ${price}`, 22, 100);
    doc.line(20, 105, 190, 105);

    doc.addImage(barcodeData, "PNG", 55, 110, 100, 30);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Thank you for choosing KMK Beehives!", 105, 150, { align: "center" });

    const pdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" });
    const storageRef = ref(storage, `receipts/${orderId}.pdf`);
    await uploadBytes(storageRef, pdfBlob);
    return await getDownloadURL(storageRef);
  };

  const downloadReceipt = () => {
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
    doc.text(`Product: ${product.name}`, 22, 90);
    doc.text(`Quantity: ${quantity}`, 22, 100);
    doc.text(`Price per unit: Ksh ${product.price}`, 22, 110);

    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: Ksh ${parseFloat(product.price) * quantity}`, 22, 120);
    doc.setLineWidth(0.3);
    doc.line(20, 125, 190, 125);

    doc.addImage(barcodeData, "PNG", 55, 130, 100, 30);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Thank you for choosing KMK Beehives!", 105, 170, { align: "center" });

    doc.save(`Receipt_${product.name}_${Date.now()}.pdf`);
  };

  return (
    <>
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="px-4 py-2">{quantity}</span>
            <button
              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-6 text-lg"
          >
            Add to Cart
          </Button>
        </div>
        <Button
          onClick={handleBuyNow}
          variant="outline"
          className="w-full mt-4 py-6 text-lg border-yellow-600 text-yellow-600 hover:bg-yellow-50"
        >
          Buy Now
        </Button>
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="p-5">
          <DialogTitle>{isPaymentSuccessful ? "Payment Successful" : "Checkout"}</DialogTitle>
          <div className="mt-4">
            {isPaymentSuccessful ? (
              <>
                <p>
                  <strong>Product:</strong> {product.name}
                </p>
                <p>
                  <strong>Quantity:</strong> {quantity}
                </p>
                <p>
                  <strong>Total Price:</strong> Ksh {parseFloat(product.price) * quantity}
                </p>
                <p>
                  <strong>Phone Number:</strong> {phoneNumber}
                </p>
                <Button
                  className="mt-4 w-full bg-yellow-600 text-white p-2 rounded"
                  onClick={downloadReceipt}
                >
                  Download Receipt
                </Button>
              </>
            ) : (
              <>
                <p>
                  <strong>Product:</strong> {product.name}
                </p>
                <p>
                  <strong>Price per Unit:</strong> Ksh {product.price}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <label className="font-bold">Quantity:</label>
                  <button
                    className="bg-gray-300 px-3 py-1 rounded"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    className="bg-gray-300 px-3 py-1 rounded"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                <p className="mt-2 font-bold text-yellow-600">
                  Total Price: Ksh {parseFloat(product.price) * quantity}
                </p>
                <Input
                  type="text"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border p-2 w-full mt-2"
                />
                <Button
                  className="mt-4 w-full bg-yellow-600 text-white p-2 rounded"
                  onClick={handlePayment}
                  disabled={polling}
                >
                  {polling ? "Processing..." : "Confirm & Pay"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductPurchaseOptions;