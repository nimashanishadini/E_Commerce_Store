"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import ProductCard from "../components/ProductCard"
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from "lucide-react"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get("/api/products/featured")
      setFeaturedProducts(response.data)
    } catch (error) {
      console.error("Error fetching featured products:", error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Free Shipping",
      description: "Free shipping on orders over $50",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: "Easy Returns",
      description: "30-day hassle-free returns",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to ShopEase</h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">Discover amazing products at unbeatable prices</p>
            <Link
              to="/products"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">Check out our most popular items</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/products" className="inline-flex items-center btn-primary text-lg px-8 py-3">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-primary-100 mb-8 text-lg">Subscribe to our newsletter for the latest deals and updates</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button className="bg-primary-700 hover:bg-primary-800 px-6 py-3 rounded-r-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
