import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Card } from "../../components/common/Card";
import { ProductGrid } from "../../components/product/ProductCard";
import { ProductSkeleton } from "../../components/common/Skeleton";
import { EmptyState } from "../../components/common/EmptyState";
import { productService } from "../../services";
import { cartService } from "../../services";
import { useCart } from "../../hooks/useCart";
import { POPULAR_BRANDS, PRICE_RANGES } from "../../utils/constants";
import toast from "react-hot-toast";

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchCart } = useCart();

  // Filters
  const [filters, setFilters] = useState({
    keyword: "",
    brand: "",
    minPrice: 0,
    maxPrice: 999999,
    page: 1,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getAllProducts({
          keyword: filters.keyword || undefined,
          brand: filters.brand || undefined,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          page: filters.page,
          limit: 12,
        });

        setProducts(response.products || []);
        setPagination({
          total: response.totalProducts,
          pages: Math.ceil(response.totalProducts / 12),
          currentPage: response.currentPage,
        });
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again.");
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.keyword, filters.brand, filters.minPrice, filters.maxPrice, filters.page]);

  // Add to cart
  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      await cartService.addToCart({ productId, quantity: 1 });
      await fetchCart();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Update filter
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      keyword: "",
      brand: "",
      minPrice: 0,
      maxPrice: 999999,
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.keyword ||
    filters.brand ||
    filters.minPrice > 0 ||
    filters.maxPrice < 999999;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            All Products
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Browse our collection of {pagination.total} products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`} />
                Filters & Sorting
              </Button>
            </div>

            {/* Mobile Filters */}
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <FilterSidebar
                  filters={filters}
                  onFilterChange={updateFilter}
                  onReset={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </motion.div>
            )}

            {/* Results */}
            {loading ? (
              <ProductSkeleton count={12} />
            ) : error ? (
              <EmptyState
                title="Failed to Load Products"
                message={error}
                action={<Button onClick={() => window.location.reload()}>Try Again</Button>}
              />
            ) : products.length === 0 ? (
              <EmptyState
                title="No Products Found"
                message={`Try adjusting your filters to find what you're looking for.`}
                action={hasActiveFilters && <Button onClick={resetFilters}>Clear Filters</Button>}
              />
            ) : (
              <>
                <ProductGrid
                  products={products}
                  onAddToCart={handleAddToCart}
                  loading={loading}
                />

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === filters.page ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => updateFilter("page", page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({ filters, onFilterChange, onReset, hasActiveFilters }) => {
  return (
    <Card className="p-6 sticky top-20">
      <div className="space-y-6">
        {/* Search */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Search
          </h3>
          <Input
            placeholder="Search products..."
            value={filters.keyword}
            onChange={(e) => onFilterChange("keyword", e.target.value)}
          />
        </div>

        {/* Brand Filter */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Brand
          </h3>
          <select
            value={filters.brand}
            onChange={(e) => onFilterChange("brand", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
          >
            <option value="">All Brands</option>
            {POPULAR_BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Price Range
          </h3>
          <div className="space-y-2">
            {PRICE_RANGES.map((range) => (
              <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    filters.minPrice === range.min &&
                    filters.maxPrice === range.max
                  }
                  onChange={() => {
                    onFilterChange("minPrice", range.min);
                    onFilterChange("maxPrice", range.max);
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={onReset}
          >
            <X className="w-4 h-4" />
            Reset Filters
          </Button>
        )}
      </div>
    </Card>
  );
};
