import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";


interface Product {
  id: string;
  name: string;
  price: string;
  quantity:string;
  category:string;
  imageUrl?: string;
}



const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        // Create a query that filters by category "Beehives"
        const q = query(productsCollection, where("category", "==", "Honey"));
        const productsSnapshot = await getDocs(q);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || "",
          price: doc.data().price || "",
          quantity: doc.data().quantity || "",
          category: doc.data().category || "",
          imageUrl: doc.data().imageUrl || "/images/placeholder.jpg"
        })) as Product[];
        setProducts(productsList);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  if (loading) {
    return (
      <section className="px-6 py-16 bg-white font-poppins">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-yellow-700 mb-4">Our Honey</h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-16 bg-white font-poppins">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-yellow-700 mb-4">Our Honey</h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-16 bg-white font-poppins">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-yellow-700 mb-4">Our Honey</h2>
        <p className="text-gray-600 mb-12 text-lg">
        Explore our premium selection pure natural honey
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <Link href={`/product/${product.id}`}
                key={product.id}
                className="bg-white border border-gray-200 rounded-md overflow-hidden shadow hover:shadow-lg transition duration-300"
              >
                <div className="h-52 w-full relative">
                  <Image
                    src={product.imageUrl || "/images/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-yellow-600 font-medium mt-1">Ksh {product.price}</p>
                  <p className="text-gray-500">UNITS LEFT : {product.quantity}</p>
                  <Link href={`/product/${product.id}`}>
                    <Button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;