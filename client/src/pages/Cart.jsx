"use client"

import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <button onClick={clearCart} className="text-red-600 hover:text-red-800 text-sm">
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={item.images?.[0] || "/placeholder.svg?height=150&width=150"}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <Link
                      to={`/products/${item._id}`}
                      className="text-lg font-semibold hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 mt-1">{item.category}</p>
                    <p className="text-2xl font-bold text-primary-600 mt-2">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex flex-col items-end space-y-4">
                    <button onClick={() => removeFromCart(item._id)} className="text-red-600 hover:text-red-800 p-2">
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="w-full btn-primary text-center block mb-4">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="w-full btn-secondary text-center block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
