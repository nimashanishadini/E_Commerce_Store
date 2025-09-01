"use client"

import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { ShoppingCart, Star } from "lucide-react"
import toast from "react-hot-toast"

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  // ✅ Fix: Return nothing if product is undefined
  if (!product) return null

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    toast.success("Product added to cart!")
  }

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-400">
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0] || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">${product.price.toFixed(2)}</span>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>

        <div className="mt-2 text-sm text-gray-600">
          {product.stock > 0 ? (
            <span>In Stock ({product.stock} available)</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
