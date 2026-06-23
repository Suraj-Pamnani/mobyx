import { motion } from "framer-motion";

export const Card = ({
  children,
  className = "",
  hover = true,
  onClick = null,
  as = "div",
  ...props
}) => {
  const Component = as;
  const content = (
    <Component
      className={`
        rounded-lg border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-800
        transition-all duration-200
        ${hover ? 'hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );

  if (as === 'button') {
    return (
      <motion.button
        whileHover={hover ? { scale: 1.02 } : {}}
        whileTap={hover ? { scale: 0.98 } : {}}
      >
        {content}
      </motion.button>
    );
  }

  return content;
};

export const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const variants = {
    primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
    success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    secondary: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs font-medium",
    md: "px-3 py-1 text-sm font-medium",
    lg: "px-4 py-2 text-base font-medium",
  };

  return (
    <span
      className={`
        inline-block rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`
          bg-white dark:bg-slate-800
          rounded-lg shadow-xl max-w-md w-full
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </h2>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export const Alert = ({
  variant = "info",
  title,
  children,
  closeable = false,
  onClose = null,
}) => {
  const variants = {
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
  };

  return (
    <div className={`rounded-lg border p-4 ${variants[variant]}`}>
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {children}
      {closeable && onClose && (
        <button
          onClick={onClose}
          className="float-right text-lg leading-none opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
};
