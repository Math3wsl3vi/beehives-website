import Services from '@/components/home/ServicesSection'
import Link from 'next/link'
import React from 'react'

const ServicesPage = () => {
  return (
    <div>
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
              <span className="text-sm text-yellow-600 font-medium">Services</span>
            </div>
          </li>
        </ol>
      </nav>

      <section id="products" className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Services/>
        </div>
      </section>

    </div>
  )
}

export default ServicesPage