"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "@/configs/firebaseConfig";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setFetching(true);
      setError("");
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList: Product[] = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      }));
      setProducts(productList);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setFetching(false);
    }
  };

  const updateQuantity = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "products", selectedProduct.id), {
        quantity: newQuantity,
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, quantity: newQuantity }
            : product
        )
      );
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 overflow-x-auto font-poppins">
      <h1 className="text-2xl font-bold text-center">Manage Products</h1>
      <Link href="/admin/items/add">
        <Button className="bg-orange-1 w-full text-lg rounded-none mt-3 md:w-1/3">
          Add Product
        </Button>
      </Link>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {fetching ? (
        <div className="mt-8 text-center">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="mt-8 text-center">No products found</div>
      ) : (
        <table className="w-full mt-4 border min-w-max">
          <thead>
            <tr className="text-left">
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border px-4 py-2">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.category}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2">Ksh {product.price}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <Button
                    className="bg-orange-1 text-white px-4 py-1 rounded"
                    onClick={() => {
                      setSelectedProduct(product);
                      setNewQuantity(product.quantity);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-black text-white px-4 py-1 rounded"
                    onClick={() => deleteProduct(product.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Quantity Dialog */}
      {selectedProduct && (
        <Dialog open={true} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Quantity for {selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <label className="text-lg font-semibold">Quantity:</label>
              <Input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                className="text-center"
              />
            </div>
            <DialogFooter className="flex gap-5">
              <Button
                className="bg-black"
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-orange-500 text-white"
                onClick={updateQuantity}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminProducts;