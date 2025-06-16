"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import ProductCard from "../components/ProductCard"
import { Filter } from "lucide-react"

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
  })
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Beauty", "Toys", "Automotive"]

  useEffect(() => {
    fetchProducts()
  }, [currentPage, filters])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(filters.category && { category: filters.category }),
        ...(filters.search && { keyword: filters.search }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
      })

      const response = await axios.get(`/api/products?${params}`)
      setProducts(response.data.products)
      setTotalPages(response.data.pages)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)

    // Update URL params
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      search: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
    })
    setSearchParams({})
    setCurrentPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 btn-secondary w-full justify-center"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="input-field"
                >
                  <option value="createdAt">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="-rating">Rating</option>
                </select>
              </div>

              <button onClick={clearFilters} className="w-full btn-secondary">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products {filters.search && `for "${filters.search}"`}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{products.length} products</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, index) => (
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
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found.</p>
              <button onClick={clearFilters} className="mt-4 btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === index + 1
                            ? "bg-primary-600 text-white border-primary-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
