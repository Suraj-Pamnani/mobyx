import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home, Package } from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { ROUTES } from "../utils/constants";
import { formatPrice, formatDate } from "../utils/format";

export const OrderConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app, you'd fetch the order details from the server
  // For now, this is a success confirmation page

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-slate-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto" />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Thank you for your purchase. Your order has been successfully placed.
            </p>

            {/* Order ID */}
            <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Order ID
              </p>
              <p className="text-lg font-mono font-semibold text-slate-900 dark:text-slate-50">
                #{id?.substring(0, 12)}...
              </p>
            </div>

            {/* Confirmation Message */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-8">
              <p className="text-sm text-green-700 dark:text-green-400">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>

            {/* Next Steps */}
            <div className="text-left mb-8">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
                What Happens Next:
              </h3>
              <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>✓ Order processing starts immediately</li>
                <li>✓ We'll notify you once item is shipped</li>
                <li>✓ Track your delivery in real-time</li>
                <li>✓ Receive your product within 3-5 days</li>
              </ol>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate(ROUTES.HOME)}
              variant="primary"
              className="w-full flex gap-2 justify-center"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
            <Button
              onClick={() => navigate(ROUTES.PRODUCTS)}
              variant="secondary"
              className="w-full flex gap-2 justify-center"
            >
              <Package className="w-4 h-4" />
              Continue Shopping
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Need help?{" "}
          <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            Contact Support
          </a>
        </p>
      </motion.div>
    </div>
  );
};
