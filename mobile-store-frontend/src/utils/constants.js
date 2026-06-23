// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// App Configuration
export const APP_NAME = "Mobile Store";
export const ITEMS_PER_PAGE = 12;
export const TIMEOUT = 10000;

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  CART: "cart",
  THEME: "theme",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

// Price & Currency
export const CURRENCY = {
  SYMBOL: "₹",
  CODE: "INR",
};

// Product Filters
export const PRICE_RANGES = [
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 - ₹30,000", min: 10000, max: 30000 },
  { label: "₹30,000 - ₹60,000", min: 30000, max: 60000 },
  { label: "Over ₹60,000", min: 60000, max: 999999 },
];

export const POPULAR_BRANDS = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Xiaomi",
  "Google",
  "Oppo",
  "Vivo",
  "Realme",
];

// Order Status
export const ORDER_STATUS = {
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const PAYMENT_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

// Routes
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/order-confirmation/:id",
  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  NOT_FOUND: "/not-found",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Please log in to continue.",
  FORBIDDEN: "You don't have permission for this action.",
  NOT_FOUND: "Resource not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  DUPLICATE_REVIEW: "You have already reviewed this product.",
  EMPTY_CART: "Your cart is empty. Add some products!",
  PAYMENT_ERROR: "Payment failed. Please try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Logged in successfully!",
  REGISTER: "Account created successfully!",
  LOGOUT: "Logged out successfully!",
  ADD_TO_CART: "Added to cart!",
  REMOVE_FROM_CART: "Removed from cart!",
  UPDATE_CART: "Cart updated!",
  PLACE_ORDER: "Order placed successfully!",
  PAYMENT_SUCCESS: "Payment successful!",
  REVIEW_ADDED: "Review added successfully!",
};

// Role-Based Access
export const ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
};
