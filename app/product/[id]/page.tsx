import { notFound } from "next/navigation";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Star, Shield, Truck, Check } from "lucide-react";
import Link from "next/link";
import ProductTabs from "@/components/home/Producttabs";

interface Product {
  id: string;
  name: string;
  price: string;
  quantity: string;
  category: string;
  desc?: string;
  imageUrl?: string;
}

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const productRef = doc(db, "products", params.id);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) return notFound();

  const product = {
    id: productSnap.id,
    ...productSnap.data()
  } as Product;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-poppins">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-sm text-gray-700 hover:text-yellow-600 inline-flex items-center">
              Home
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sm text-yellow-600 ml-1 md:ml-2 font-medium">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 shadow-lg">
            <Image
              src={product.imageUrl || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-md bg-gray-100 overflow-hidden">
                <Image
                  src={product.imageUrl || "/images/placeholder.jpg"}
                  alt={`${product.name} thumbnail ${i}`}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">(24 reviews)</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-3xl font-semibold text-yellow-600">
              Ksh {product.price}
              {parseInt(product.price) > 5000 && (
                <span className="text-sm text-gray-500 line-through ml-2">Ksh {parseInt(product.price) + 1000}</span>
              )}
            </p>
            
            <div className="flex items-center space-x-2 text-sm">
              <span className={`px-2 py-1 rounded-full ${parseInt(product.quantity) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {parseInt(product.quantity) > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="text-gray-500">{product.quantity} units available</span>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              {product.desc || "Premium quality beehive crafted with sustainable materials for optimal honey production and bee health."}
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Durable wood construction</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Weather-resistant finish</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Easy-access honey frames</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Ventilated design for optimal bee health</span>
              </li>
            </ul>
          </div>

          {/* Purchase Options */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">-</button>
                <span className="px-4 py-2">1</span>
                <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
              </div>
              <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-6 text-lg">
                Add to Cart
              </Button>
            </div>

            <Button variant="outline" className="w-full mt-4 py-6 text-lg border-yellow-600 text-yellow-600 hover:bg-yellow-50">
              Buy Now
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="flex flex-col items-center text-center">
              <Truck className="h-8 w-8 text-yellow-600 mb-2" />
              <span className="text-sm font-medium">Free Shipping</span>
              <span className="text-xs text-gray-500">On orders over Ksh 5,000</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="h-8 w-8 text-yellow-600 mb-2" />
              <span className="text-sm font-medium">1-Year Warranty</span>
              <span className="text-xs text-gray-500">Quality guaranteed</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <svg className="h-8 w-8 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium">Secure Payment</span>
              <span className="text-xs text-gray-500">SSL encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
     <ProductTabs/>
     
    </div>

  );
};

export default ProductPage;