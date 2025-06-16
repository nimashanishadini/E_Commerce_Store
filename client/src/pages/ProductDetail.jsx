"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useCart } from "../context/CartContext"
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react"
import toast from "react-hot-toast"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`)
      setProduct(response.data)
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Product not found")
      navigate("/products")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    toast.success(`${quantity} item(s) added to cart!`)
  }

  const updateQuantity = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-6 bg-gray-300 rounded"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.images?.[selectedImage] || "/placeholder.svg?height=500&width=500"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary-600" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.numReviews} reviews)</span>
            </div>
            <p className="text-3xl font-bold text-primary-600 mb-4">${product.price.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Brand:</span> {product.brand}
            </div>
            <div>
              <span className="font-semibold">Category:</span> {product.category}
            </div>
            <div>
              <span className="font-semibold">Stock:</span> {product.stock} available
            </div>
            <div>
              <span className="font-semibold">SKU:</span> {product._id.slice(-8).toUpperCase()}
            </div>
          </div>

          {product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(1)}
                    disabled={quantity >= product.stock}
                    className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-3"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-red-600 font-semibold text-lg">Out of Stock</p>
              <p className="text-gray-600">This item is currently unavailable</p>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Product Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• High-quality materials</li>
              <li>• Fast and reliable shipping</li>
              <li>• 30-day return policy</li>
              <li>• Customer satisfaction guaranteed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
