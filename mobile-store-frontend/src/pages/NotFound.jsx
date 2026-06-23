import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/common/Button";
import { ROUTES } from "../../utils/constants";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-9xl font-bold text-slate-900 dark:text-slate-50 mb-4"
        >
          404
        </motion.h1>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Page Not Found
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => navigate(ROUTES.HOME)}
            variant="primary"
            className="w-full"
          >
            Go to Home
          </Button>
          <Button
            onClick={() => navigate(ROUTES.PRODUCTS)}
            variant="secondary"
            className="w-full"
          >
            Browse Products
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
