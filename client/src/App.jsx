import { Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
