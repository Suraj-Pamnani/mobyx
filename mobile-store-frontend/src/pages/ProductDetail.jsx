import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input, Textarea } from "../../components/common/Input";
import { Card, Badge } from "../../components/common/Card";
import { Rating, ReviewList } from "../../components/common/Rating";
import { DetailSkeleton } from "../../components/common/Skeleton";
import { productService, cartService } from "../../services";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../utils/format";
import { ROUTES } from "../../utils/constants";
import toast from "react-hot-toast";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  const inStock = product?.stock > 0;

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getProductById(id);
        setProduct(response);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details");
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Add to cart
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to cart");
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      setAddingToCart(true);
      await cartService.addToCart({ productId: id, quantity });
      await fetchCart();
      toast.success("Added to cart!");
      setQuantity(1);
    } catch (error) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please log in to add a review");
      navigate(ROUTES.LOGIN);
      return;
    }

    if (!reviewData.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      setReviewLoading(true);
      await productService.addReview(id, {
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      toast.success("Review added successfully!");
      setReviewData({ rating: 5, comment: "" });
      // Refetch product to get updated reviews
      const updated = await productService.getProductById(id);
      setProduct(updated);
    } catch (error) {
      toast.error(error.message || "Failed to add review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Product Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.modelName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-slate-400">No image</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Brand & Title */}
            <div>
              <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                {product.modelName}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <Rating value={Math.round(product.rating)} count={product.numReviews} />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {product.numReviews} reviews
                </span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                {formatPrice(product.price)}
              </div>
              <div className="flex items-center gap-3">
                {inStock ? (
                  <>
                    <Badge variant="success">In Stock</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {product.stock} available
                    </span>
                  </>
                ) : (
                  <Badge variant="danger">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Description
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!inStock}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!inStock}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={!inStock || addingToCart}
                loading={addingToCart}
              >
                Add to Cart
              </Button>
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
              <Share2 className="w-5 h-5" />
              Share Product
            </button>
          </motion.div>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">
                Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="pb-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      {key}
                    </p>
                    <p className="text-lg text-slate-900 dark:text-slate-50">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-8">
              Customer Reviews
            </h2>

            {/* Add Review Form */}
            {user && (
              <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  Share Your Review
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setReviewData((prev) => ({ ...prev, rating: star }))
                          }
                          className={`text-3xl transition-colors ${
                            star <= reviewData.rating
                              ? "text-yellow-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    label="Your Review"
                    placeholder="Share your experience with this product..."
                    rows={4}
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                  />
                  <Button
                    onClick={handleSubmitReview}
                    variant="primary"
                    loading={reviewLoading}
                    disabled={reviewLoading}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            )}

            {!user && (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(ROUTES.LOGIN);
                    }}
                    className="font-semibold hover:underline"
                  >
                    Sign in
                  </a>{" "}
                  to leave a review
                </p>
              </div>
            )}

            {/* Reviews List */}
            <ReviewList reviews={product.reviews || []} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
