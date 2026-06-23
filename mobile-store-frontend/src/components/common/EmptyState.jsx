import { motion } from "framer-motion";
import { Button } from "./Button";

export const EmptyState = ({ 
  icon: Icon, 
  title = "Nothing here", 
  message = "", 
  action = null,
  className = "" 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
  >
    {Icon && (
      <Icon className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-6" />
    )}
    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
      {title}
    </h3>
    {message && (
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
        {message}
      </p>
    )}
    {action && <div>{action}</div>}
  </motion.div>
);

export const ErrorState = ({ 
  title = "Something went wrong",
  message = "Please try again or contact support.",
  onRetry = null,
  icon: Icon,
  className = ""
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
  >
    {Icon && (
      <Icon className="w-16 h-16 text-red-400 dark:text-red-600 mb-6" />
    )}
    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
      {title}
    </h3>
    {message && (
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
        {message}
      </p>
    )}
    {onRetry && (
      <Button 
        onClick={onRetry}
        variant="primary"
        size="sm"
      >
        Try Again
      </Button>
    )}
  </motion.div>
);

export const NotFoundState = ({ 
  title = "Page not found",
  message = "The page you're looking for doesn't exist.",
  action = null
}) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {title}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
        {message}
      </p>
      {action}
    </div>
  </div>
);
