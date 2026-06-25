import apiClient from "./api";

// ============ AUTH SERVICE ============
export const authService = {
  // Register new user
  register: (data) => apiClient.post("/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password,
  }),

  // Login user
  login: (credentials) => apiClient.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  }),

  // Get current user profile
  getProfile: () => apiClient.get("/auth/profile"),

  // Check admin access
  checkAdmin: () => apiClient.get("/auth/admin"),
};

// ============ PRODUCT SERVICE ============
export const productService = {
  // Get all products with filters
  getAllProducts: (params) => apiClient.get("/products", { params }),

  // Get single product by ID
  getProductById: (id) => apiClient.get(`/products/${id}`),

  // Create product (admin only)
  createProduct: (data) => apiClient.post("/products", data),

  // Add review to product
  addReview: (productId, data) => apiClient.post(`/products/${productId}/review`, {
    rating: data.rating,
    comment: data.comment,
  }),

  // Update product (admin only)
  updateProduct: (id, data) => apiClient.put(`/products/${id}`, data),

  // Delete product (admin only)
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};

// ============ CART SERVICE ============
export const cartService = {
  // Add product to cart
  addToCart: (data) => apiClient.post("/cart/add", {
    product: data.productId,
    quantity: data.quantity || 1,
  }),

  // Get user's cart
  getCart: () => apiClient.get("/cart"),

  // Update item quantity in cart
  updateCart: (data) => apiClient.put("/cart/update", {
    product: data.productId,
    quantity: data.quantity,
  }),

  // Remove item from cart
  removeFromCart: (productId) => apiClient.delete("/cart/remove", {
    data: { product: productId },
  }),

  // Get cart total
  getTotal: () => apiClient.get("/cart/total"),
};

// ============ ORDER SERVICE ============
export const orderService = {
  // Create order and get Razorpay order
  createOrder: (data) => apiClient.post("/orders/create", {
    address: data.address,
  }),

  // Verify payment and complete order
  verifyPayment: (data) => apiClient.post("/orders/verify", {
    razorpay_order_id: data.razorpay_order_id,
    razorpay_payment_id: data.razorpay_payment_id,
    razorpay_signature: data.razorpay_signature,
    orderId: data.orderId,
  }),

  // Get all orders (admin only)
  getAllOrders: () => apiClient.get("/orders/admin/all"),

  // Get single order by ID
  getOrderById: (id) => apiClient.get(`/orders/admin/${id}`),

  // Update order status (admin only)
  updateOrderStatus: (id, status) => apiClient.put(`/orders/admin/${id}`, {
    orderStatus: status,
  }),
};
