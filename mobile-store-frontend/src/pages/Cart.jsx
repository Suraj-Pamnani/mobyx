import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "../components/common/Button";
import { Card, Badge } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { CartItemSkeleton } from "../components/common/Skeleton";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { cartService } from "../services";
import { formatPrice, calculateDiscountedPrice } from "../utils/format";
import { ROUTES } from "../utils/constants";
import toast from "react-hot-toast";

export const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, fetchCart } = useCart();
  const [updatingItems, setUpdatingItems] = useState({});

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  // Update quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItems((prev) => ({
        ...prev,
        [productId]: true,
      }));
      await cartService.updateCart({ productId, quantity: newQuantity });
      await fetchCart();
      toast.success("Cart updated!");
    } catch (error) {
      toast.error(error.message || "Failed to update cart");
    } finally {
      setUpdatingItems((prev) => ({
        ...prev,
        [productId]: false,
      }));
    }
  };

  // Remove item
  const handleRemoveItem = async (productId) => {
    try {
      setUpdatingItems((prev) => ({
        ...prev,
        [productId]: true,
      }));
      await cartService.removeFromCart(productId);
      await fetchCart();
      toast.success("Item removed from cart!");
    } catch (error) {
      toast.error(error.message || "Failed to remove item");
    } finally {
      setUpdatingItems((prev) => ({
        ...prev,
        [productId]: false,
      }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            icon={ShoppingCart}
            title="Please Sign In"
            message="You need to be signed in to view your cart"
            action={
              <Button
                onClick={() => navigate(ROUTES.LOGIN)}
                variant="primary"
              >
                Sign In
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">
            Shopping Cart
          </h1>
          <CartItemSkeleton count={3} />
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + (calculateDiscountedPrice(item.product.price, item.product.discount) * item.quantity),
    0
  );
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 50000 ? 0 : 500; // Free shipping over 50k
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">
          Shopping Cart
        </h1>

        {isEmpty ? (
          <EmptyState
            icon={ShoppingCart}
            title="Your Cart is Empty"
            message="Start shopping to add items to your cart"
            action={
              <Button
                onClick={() => navigate(ROUTES.PRODUCTS)}
                variant="primary"
              >
                Continue Shopping
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.product._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="p-4 flex gap-4">
                      {/* Product Image */}
                      <div
                        className="flex-shrink-0 w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() =>
                          navigate(
                            `${ROUTES.PRODUCTS}/${item.product._id}`
                          )
                        }
                      >
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.modelName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-slate-900 dark:text-slate-50 truncate cursor-pointer hover:underline"
                          onClick={() =>
                            navigate(
                              `${ROUTES.PRODUCTS}/${item.product._id}`
                            )
                          }
                        >
                          {item.product.modelName}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {item.product.brand}
                        </p>

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={updatingItems[item.product._id]}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={updatingItems[item.product._id]}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                              {formatPrice(calculateDiscountedPrice(item.product.price, item.product.discount) * item.quantity)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {item.product.discount > 0 ? (
                                <>
                                  <span className="line-through text-red-400 mr-1">{formatPrice(item.product.price)}</span>
                                  {formatPrice(calculateDiscountedPrice(item.product.price, item.product.discount))} each
                                </>
                              ) : (
                                <>{formatPrice(item.product.price)} each</>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={updatingItems[item.product._id]}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Subtotal ({items.length} items)
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Tax (18% GST)
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Shipping
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-50">
                        {formatPrice(shipping)}
                      </span>
                    </div>
                  )}
                  {shipping === 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Shipping
                      </span>
                      <Badge variant="success">Free</Badge>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(total)}
                  </span>
                </div>

                <Button
                  onClick={() => navigate(ROUTES.CHECKOUT)}
                  variant="primary"
                  className="w-full mb-3"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  onClick={() => navigate(ROUTES.PRODUCTS)}
                  variant="secondary"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
