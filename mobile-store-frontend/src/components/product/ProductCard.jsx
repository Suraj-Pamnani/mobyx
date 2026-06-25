import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Rating } from "../../components/common/Rating";
import { Badge } from "../../components/common/Card";
import { formatPrice, calculateDiscountedPrice } from "../../utils/format";
import { ROUTES } from "../../utils/constants";

export const ProductCard = ({ product, onAddToCart, loading = false }) => {
  const navigate = useNavigate();
  const inStock = product.stock > 0;
  const hasReviews = product.reviews && product.reviews.length > 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="h-full overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => navigate(`${ROUTES.PRODUCTS}/${product._id}`)}
      >
        {/* Image Container */}
        <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-700 overflow-hidden">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.modelName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No image
            </div>
          )}

          {/* Stock Badge */}
          {!inStock && (
            <Badge
              variant="danger"
              className="absolute top-3 right-3"
            >
              Out of Stock
            </Badge>
          )}

          {product.stock < 5 && inStock && (
            <Badge
              variant="warning"
              className="absolute top-3 right-3"
            >
              Low Stock
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Brand */}
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-2">
            {product.brand}
          </p>

          {/* Model Name */}
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 line-clamp-2 mb-2 flex-1">
            {product.modelName}
          </h3>

          {/* Rating */}
          {hasReviews && (
            <div className="mb-3">
              <Rating value={Math.round(product.rating)} count={product.numReviews} size="sm" />
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            {product.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(calculateDiscountedPrice(product.price, product.discount))}
                </span>
                <span className="text-sm text-slate-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product._id);
            }}
          >
            <Button
              variant={inStock ? "primary" : "secondary"}
              size="sm"
              className="w-full"
              disabled={!inStock || loading}
              loading={loading}
            >
              <ShoppingCart className="w-4 h-4" />
              {inStock ? "Add to Cart" : "Unavailable"}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export const ProductGrid = ({ products, loading, onAddToCart, error = null }) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={onAddToCart}
          loading={loading}
        />
      ))}
    </div>
  );
};
