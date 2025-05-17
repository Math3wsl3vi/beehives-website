"use client";
import React, { useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const AddItem = () => {
  const router = useRouter();
  const storage = getStorage();

  const [item, setItem] = useState<{
    name: string;
    category: string;
    price: string;
    quantity: string;
    image: File | null;
  }>({
    name: "",
    category: "Honey",
    price: "",
    quantity: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (file: File) => {
    try {
      const storageRef = ref(storage, `products/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = "";
      if (item.image) {
        imageUrl = await handleImageUpload(item.image);
      }

      await addDoc(collection(db, "products"), {
        name: item.name,
        category: item.category,
        price: Number(item.price),
        quantity: Number(item.quantity),
        imageUrl,
      });

      setMessage("Item added successfully!");
      setItem({
        name: "",
        category: "Honey",
        price: "",
        quantity: "",
        image: null,
      });
      router.push("/admin/items");
    } catch (error) {
      setMessage("Failed to add item. Check console for errors.");
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg font-poppins bg-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Add Beekeeping Item</h2>
      {message && (
        <p className="text-sm text-center text-green-600">{message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Item Name</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={item.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="Honey">Honey</option>
            <option value="Gear">Gear (Smoker, Suit, etc.)</option>
            <option value="Beehives">Beehives</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price (KES)</label>
          <input
            type="number"
            name="price"
            value={item.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setItem({
                ...item,
                image: e.target.files ? e.target.files[0] : null,
              })
            }
            className="border p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-700 text-white py-2 rounded hover:bg-yellow-800 transition"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
