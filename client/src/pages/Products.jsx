"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import ProductCard from "../components/ProductCard"
import { Filter, X, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    inStock: searchParams.get("inStock") === "true" || false
  })
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  const categories = [
    "Electronics", "Clothing", "Home & Garden", "Sports",
    "Books", "Beauty", "Toys", "Automotive"
  ]

  const sortOptions = [
    { value: "createdAt", label: "Newest" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
    { value: "name", label: "Name: A-Z" },
    { value: "-name", label: "Name: Z-A" },
    { value: "-rating", label: "Top Rated" },
    { value: "-sold", label: "Bestsellers" }
  ]

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
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.inStock && { inStock: filters.inStock })
      })

      const response = await axios.get(`/api/products?${params}`)
      setProducts(response.data?.products || [])
      setTotalPages(response.data?.pages || 1)
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)

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
      inStock: false
    })
    setSearchParams({})
    setCurrentPage(1)
  }

  const activeFiltersCount = Object.values(filters).filter(
    val => val !== "" && val !== false && val !== "createdAt"
  ).length

  // Custom button component
  const Button = ({ children, onClick, className = "", disabled = false, variant = "default" }) => {
    const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 hover:bg-gray-50",
      ghost: "hover:bg-gray-100",
      secondary: "bg-gray-100 hover:bg-gray-200"
    }
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {children}
      </button>
    )
  }

  // Custom input component
  const Input = ({ value, onChange, placeholder, type = "text", className = "" }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  )

  // Custom badge component
  const Badge = ({ children, onClick, className = "" }) => (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-gray-200 ${className}`}
    >
      {children}
    </span>
  )

  // Loading skeleton component
  const Skeleton = ({ className = "" }) => (
    <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`}></div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search products..."
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.category && (
            <Badge onClick={() => handleFilterChange("category", "")}>
              {filters.category}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.search && (
            <Badge onClick={() => handleFilterChange("search", "")}>
              Search: {filters.search}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Badge onClick={() => {
              handleFilterChange("minPrice", "")
              handleFilterChange("maxPrice", "")
            }}>
              Price: {filters.minPrice || "0"} - {filters.maxPrice || "∞"}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.inStock && (
            <Badge onClick={() => handleFilterChange("inStock", false)}>
              In Stock Only
              <X className="h-3 w-3" />
            </Badge>
          )}
          <button
            onClick={clearFilters}
            className="text-blue-500 ml-2 text-sm hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filters */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black bg-opacity-50">
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                      placeholder="Min"
                    />
                    <Input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label className="text-sm font-medium">In Stock Only</label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Filters */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="bg-white p-6 rounded-lg border sticky top-8">
            <h3 className="font-semibold text-lg mb-6">Filters</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    placeholder="Min"
                  />
                  <Input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">In Stock Only</label>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {filters.search ? `Search results for "${filters.search}"` : 
               filters.category ? `${filters.category} Products` : 
               "All Products"}
            </h1>
            <div className="text-sm text-gray-500">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin inline" />
              ) : (
                `Showing ${products.length} of ${totalPages * 12} products`
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    onClick={() => navigate(`/products/${product._id}`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
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