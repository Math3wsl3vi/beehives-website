import HoneySection from '@/components/home/HoneySection';
import ProductsSection from '@/components/home/ProductsSection';
import React from 'react';
import Link from 'next/link';
import { Truck, Shield, Lock } from 'lucide-react';

const ProductsPage = () => {
  return (
    <main className="font-poppins">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-50 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Discover Our Beehives & Honey
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Shop premium beehives, beekeeping gear, and pure honey crafted with care for sustainability and quality.
          </p>
          <Link
            href="#products"
            className="inline-block bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition-colors text-lg font-semibold"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-sm text-gray-700 hover:text-yellow-600">
              Home
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sm text-yellow-600 font-medium">Products</span>
            </div>
          </li>
        </ol>
      </nav>
      {/* Products Section */}
      <section id="products" className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Beehives</h2>
          <ProductsSection />
        </div>
      </section>

      {/* Honey Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Premium Honey</h2>
          <HoneySection />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="h-10 w-10 text-yellow-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over Ksh 5,000</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-10 w-10 text-yellow-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">1-Year Warranty</h3>
              <p className="text-sm text-gray-600">Quality guaranteed</p>
            </div>
            <div className="flex flex-col items-center">
              <Lock className="h-10 w-10 text-yellow-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-600">SSL encrypted</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    
  );
};

export default ProductsPage;