import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Card } from "../../components/common/Card";
import { checkoutSchema } from "../../utils/validation";
import { useCart } from "../../hooks/useCart";
import { orderService } from "../../services";
import { formatPrice } from "../../utils/format";
import { ROUTES } from "../../utils/constants";
import toast from "react-hot-toast";

// Razorpay integration
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shipping = subtotal > 50000 ? 0 : 500;
  const total = subtotal + tax + shipping;

  // Form submission
  const onSubmit = async (formData) => {
    if (isEmpty) {
      toast.error("Your cart is empty!");
      navigate(ROUTES.CART);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create order on backend
      const orderResponse = await orderService.createOrder({
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}`,
      });

      const { orderId, razorpayOrder } = orderResponse;

      // Load Razorpay
      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        setError("Failed to load payment gateway. Please try again.");
        toast.error("Payment gateway error");
        return;
      }

      // Open Razorpay payment modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Mobile Store",
        description: `Order #${orderId}`,
        prefill: {
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async (response) => {
          try {
            // Verify payment on backend
            await orderService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            toast.success("Payment successful!");
            navigate(`${ROUTES.ORDER_CONFIRMATION}/${orderId}`);
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
            toast.error("Payment verification failed");
            console.error("Payment verification error:", err);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (err) {
      const message = err.message || "Failed to create order";
      setError(message);
      toast.error(message);
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Add items to your cart before proceeding to checkout
            </p>
            <Button onClick={() => navigate(ROUTES.CART)}>
              Back to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-8">
          Checkout
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6">
                Shipping Address
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="John"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    error={errors.lastName?.message}
                    {...register("lastName")}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="9876543210"
                  error={errors.phone?.message}
                  {...register("phone")}
                />

                <Input
                  label="Street Address"
                  placeholder="123 Main Street"
                  error={errors.address?.message}
                  {...register("address")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    placeholder="New Delhi"
                    error={errors.city?.message}
                    {...register("city")}
                  />
                  <Input
                    label="State"
                    placeholder="Delhi"
                    error={errors.state?.message}
                    {...register("state")}
                  />
                  <Input
                    label="Pincode"
                    placeholder="110001"
                    error={errors.pincode?.message}
                    {...register("pincode")}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-slate-600 dark:text-slate-400">
                      {item.product.modelName} × {item.quantity}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Subtotal
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Tax (18%)
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
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Total
                </span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                  ✓ Secure Razorpay Payment Gateway
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
