# AI Agent Instructions for Mobile Store

This document helps AI coding agents quickly understand and contribute to the mobile store project.

## Quick Start

**Tech Stack:**
- Frontend: React 18 with Vite, Tailwind CSS, shadcn/ui, Framer Motion
- Backend: Express.js with MongoDB (Mongoose), JWT authentication
- Payment: Razorpay integration

**Development:**
```bash
# Backend (from mobile-store-backend/)
npm install
npm run dev          # Runs with nodemon on port 5000
npm start            # Production mode

# Frontend (from mobile-store-frontend/)
npm install
npm run dev          # Vite dev server
npm run build        # Production build
```

**Required Environment Variables:**
```
# Backend (.env)
MONGO_URI=mongodb://...
JWT_SECRET=your_jwt_secret
PORT=5000
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

## Architecture Overview

### Backend Structure
- **models/**: Mongoose schemas (User, Product, Cart, Order)
- **controllers/**: Business logic for auth, cart, products, orders
- **routes/**: Express route definitions with middleware
- **middleware/**: Authentication (JWT), validation, error handling
- **config/**: Database connection

### Frontend Structure
- **src/components/**: Reusable React components (button, card, form, etc. from shadcn/ui)
- **src/pages/**: Page-level components (Home, ProductDetail, Cart, Checkout)
- **src/services/**: API calls and data fetching logic
- **src/hooks/**: Custom React hooks for shared logic
- **src/context/**: Global state (auth, cart, theme)
- **src/styles/**: Tailwind configuration and utilities
- **src/assets/**: Images, icons, static files

## Code Conventions

### API Response Format (Backend)
All endpoints return a consistent structure:
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Authentication
- JWT tokens are used for stateless authentication
- Tokens include `userId` and `role` (customer/admin)
- Middleware: `authMiddleware.js` verifies token from `Authorization: Bearer <token>` header
- Role-based access control: Some routes require specific roles (e.g., admin-only)

### Data Models
- **User**: email, password (hashed), name, role (customer/admin), createdAt
- **Product**: title, description, price, stock, category, images
- **Cart**: userId reference, items array with quantity, totalPrice
- **Order**: userId reference, items array, totalAmount, status, paymentId (Razorpay)

### Error Handling
- Backend: Always respond with `{success: false, message: "error details"}`
- Frontend: Display user-friendly error messages; log detailed errors for debugging
- Use try-catch for async operations; avoid silent failures

### Response & Pagination
- List endpoints support pagination via query params: `?page=1&limit=10`
- Response includes `total`, `page`, `pages` for list operations

## Frontend Development Patterns

### Component Development
**Structure & Composition:**
- Use functional components with React hooks exclusively (no class components)
- Keep components small and focused (max ~150 lines); break into sub-components if larger
- Use `React.memo` for expensive components that receive stable props (lists, tables)
- Avoid deeply nested prop drilling; use Context or custom hooks instead
- Each component should have one primary responsibility

**Example Pattern:**
```jsx
// ❌ Bad: 300-line component with multiple concerns
// ✅ Good: Split into focused components
const ProductCard = React.memo(({ product, onAddToCart }) => (
  <div className="rounded-lg border p-4 hover:shadow-lg transition-shadow">
    <h3 className="font-semibold">{product.title}</h3>
    <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
    <div className="flex items-center justify-between mt-4">
      <span className="text-lg font-bold">${product.price}</span>
      <Button onClick={() => onAddToCart(product.id)} variant="primary" size="sm">Add</Button>
    </div>
  </div>
));
ProductCard.displayName = "ProductCard";
```

### State Management
- **Global state**: Use React Context for auth, cart, theme (anything needed across routes)
- **Local state**: Use `useState` for component-specific state (form inputs, UI toggles)
- **Complex state**: Use `useReducer` for state machines (multi-step forms, checkout flows)
- **Callbacks**: Use `useCallback` to memoize functions passed to memoized children
- **Effects**: Always specify dependencies; use linter to catch issues

**Pattern for Context:**
```jsx
// Provide at app root level
<AuthProvider>
  <CartProvider>
    <App />
  </AuthProvider>
</AuthProvider>

// Use custom hook to access
const { user, isAuthenticated } = useAuth();
const { items, addToCart } = useCart();
```

### Styling
- **Tailwind CSS first**: No inline styles, no styled-components, no CSS modules
- **Color palette**: Use primary color scale defined in `tailwind.config.js` (primary-50 to primary-900)
- **Responsive**: Mobile-first approach: start with base styles, add `sm:`, `md:`, `lg:`, `xl:` breakpoints
- **Consistency**: Reuse spacing scale (p-2, p-4, p-6, gap-2, gap-4, etc.)
- **Dark mode**: Use `dark:` prefix for dark mode variants; it's enabled via class strategy

**Example:**
```jsx
// Mobile-first, responsive layout
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-6 lg:px-8">
  {/* Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
</div>
```

### Data Fetching & API Integration
**Pattern with Error Handling:**
```jsx
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/products");
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load products");
        console.error("Fetch error:", err); // Log for debugging
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading, error };
};
```

**Error Handling in Components:**
```jsx
// Always handle 3 states: loading, error, success
const { products, loading, error } = useProducts();

if (loading) return <ProductSkeleton count={6} />;
if (error) return <ErrorAlert message={error} onRetry={refetch} />;
if (!products.length) return <EmptyState icon="Package" message="No products found" />;

return <ProductGrid products={products} />;
```

**API Interceptors** (already configured in `src/services/api.js`):
- Request: Auto-inject JWT token from localStorage
- Response: Parse response.data, handle 401 by redirecting to login
- Never suppress errors; always log and display to user

### Forms & Validation
**Use react-hook-form + zod for all forms:**
```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await authService.login(data);
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("email")} placeholder="Email" />
      {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
      
      <input {...register("password")} type="password" placeholder="Password" />
      {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
```

**Validation Rules:**
- Validate on blur for UX feedback
- Validate on submit before API call
- Show inline error messages immediately below fields (red text, small font)
- Disable submit button while submitting or validation fails
- Use toast notifications for async validation errors only

### Loading States & Skeletons
**Create reusable skeleton components:**
```jsx
const ProductSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg border p-4 animate-pulse">
        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    ))}
  </div>
);
```

**Show loading states always:**
- Skeleton loaders for initial data fetch (match shape of final UI)
- Spinners for buttons/form submissions (disable button while loading)
- Shimmer effects for placeholders (use Tailwind's animate-pulse)

### Empty States
**Always provide meaningful empty state UI:**
```jsx
const EmptyState = ({ icon: Icon, title = "Nothing here", message, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Icon className="w-12 h-12 text-slate-300 mb-4" />
    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);
```

**Use in components:**
```jsx
if (!items.length) {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Cart is empty"
      message="Add products to get started"
      action={<Link to="/products" className="btn-primary">Continue shopping</Link>}
    />
  );
}
```

### Error Boundaries
**Implement error boundary for production safety:**
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
    // Send to error tracking service (Sentry, etc.) in production
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-2">Oops, something went wrong</h1>
          <p className="text-slate-600 mb-4">Please refresh the page or try again.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Use at root
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Accessibility & Performance
**Semantic HTML & ARIA:**
- Use semantic tags: `<button>`, `<nav>`, `<main>`, `<article>`, `<form>`, `<label>`
- Add `aria-label` for icon buttons: `<button aria-label="Close menu">`
- Link labels to inputs: `<label htmlFor="email">Email</label><input id="email" />`
- Use `role` only when semantic HTML isn't available
- Test with keyboard navigation (Tab, Enter, Space, Escape)

**Performance Optimization:**
- Code-split routes with React.lazy: `const Dashboard = lazy(() => import('./Dashboard'))`
- Lazy load images: `<img loading="lazy" src="..." />`
- Use `React.memo` for list items that don't change
- Minimize bundle: audit with `npm run build`, remove unused dependencies
- Avoid unnecessary re-renders: use dependency arrays, memoize callbacks
- Cache API responses: avoid refetching same data within same session

## Backend API Patterns

### Controllers - Production-Ready Structure
**Keep focused and reusable:**
```javascript
// ✅ Good: Single responsibility, proper error handling
const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Validate input
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid pagination params" 
      });
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find().skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    res.json({
      success: true,
      message: "Products fetched",
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    next(error); // Pass to error middleware
  }
};
```

**Controller Best Practices:**
- Always validate input at the start (query params, body, auth)
- Use async/await with try-catch for clarity
- Check authorization before sensitive operations
- Use Mongoose methods (findById, findByIdAndUpdate, deleteOne)
- Never return sensitive data (passwords, API keys)
- Pass errors to error middleware with `next(error)`
- Always return consistent response format

### Error Handling Middleware
**Centralized error handler:**
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  console.error(`[${status}] ${message}`, err);

  // Don't expose internal error details in production
  const isDev = process.env.NODE_ENV === "development";
  const errorResponse = {
    success: false,
    message,
    ...(isDev && { stack: err.stack }), // Only in dev
  };

  res.status(status).json(errorResponse);
};

app.use(errorHandler);
```

**Validation Error Handler:**
```javascript
// Check for validation errors before async operations
if (!email || !password) {
  return res.status(400).json({ 
    success: false, 
    message: "Email and password required" 
  });
}

// Database error handling
try {
  await user.save();
} catch (err) {
  if (err.code === 11000) { // Duplicate key
    return res.status(400).json({ 
      success: false, 
      message: "Email already registered" 
    });
  }
  throw err; // Pass to error middleware
}
```

### Models - Validation & Indexes
**Example User Model:**
```javascript
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    index: true, // Frequently queried
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false, // Never return by default
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Add method to compare passwords
userSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Add method to exclude sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
```

**Model Validation Rules:**
- Always require essential fields with clear error messages
- Use enums for fixed sets of values (role, status)
- Add indexes for frequently queried fields (email, userId, orderId)
- Use `select: false` for sensitive data (passwords, secrets)
- Add timestamps (createdAt, updatedAt) for audit trails
- Use pre-save hooks for data transformation (trim, hash, defaults)
- Use methods for common operations (comparePassword, toJSON)

### Authentication & Authorization
**JWT Middleware (already in `middleware/authMiddleware.js`):**
```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "No token provided" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid token" 
    });
  }
};
```

**Role-Based Access Control:**
```javascript
const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.role)) {
    return res.status(403).json({ 
      success: false, 
      message: "Unauthorized" 
    });
  }
  next();
};

// Usage in routes
router.delete("/products/:id", authMiddleware, requireRole("admin"), deleteProduct);
```

### Database Queries - Best Practices
**Efficient queries:**
```javascript
// ❌ Bad: Multiple queries
const user = await User.findById(userId);
const orders = await Order.find({ userId });

// ✅ Good: Single query with populate + lean
const user = await User.findById(userId)
  .populate("orders") // If relationship exists
  .lean(); // Return plain object (faster)

// ✅ Good: Batch operations
const users = await User.find({ role: "customer" })
  .select("name email") // Only needed fields
  .limit(100)
  .lean();

// ✅ Good: Pagination
const page = req.query.page || 1;
const limit = 10;
const skip = (page - 1) * limit;
const orders = await Order.find({ userId })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
```

**Query Optimization:**
- Use `.lean()` for read-only queries (returns plain JS objects)
- Use `.select()` to fetch only needed fields
- Add indexes on frequently queried fields
- Use `.countDocuments()` for counts (not `.find().length`)
- Batch operations: use `Promise.all()` for parallel queries
- Cache frequently accessed data in memory or Redis for production

### Security Best Practices
**Input Validation & Sanitization:**
```javascript
// Validate before using
if (typeof price !== "number" || price <= 0) {
  return res.status(400).json({ success: false, message: "Invalid price" });
}

// Prevent NoSQL injection
const userId = String(req.userId); // Ensure string type
const product = await Product.findById(userId);
```

**Secrets & Environment Variables:**
- Never hardcode secrets (JWT_SECRET, MongoDB URI, API keys)
- Use `.env` file locally (add to `.gitignore`)
- Set environment variables in production (environment variables, secrets manager)
- Validate required env vars at startup
- Use helmet middleware for security headers
- Set CORS properly: `origin: process.env.FRONTEND_URL`

**Password Security:**
- Hash with bcryptjs (never store plain passwords)
- Minimum 8 characters (enforce on frontend + backend)
- Don't return passwords in API responses (use `select: false`)
- Rate-limit login attempts to prevent brute force

**API Security:**
```javascript
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

app.use(helmet()); // Security headers

// Rate limit login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, try again later",
});
router.post("/login", loginLimiter, login);
```

## Common Development Tasks

### Adding a New Feature
1. Design API contract (method, endpoint, request/response format)
2. Create/update Mongoose model with validation
3. Implement controller logic with error handling
4. Add route with appropriate middleware (auth, role checks)
5. Test endpoint with Postman/curl
6. Implement frontend component (page or form)
7. Create API service method in frontend
8. Integrate with UI, handle loading/error/success states

### Fixing Bugs
- Check error logs in terminal (backend and frontend console)
- Use browser DevTools (Network tab for API, Console for errors)
- Verify environment variables are set correctly
- Test with different user roles/permissions if applicable
- Check database state using MongoDB client
- Add console logs to isolate issue
- Fix at the root cause, not just symptoms

### Optimizing Performance
- Identify bottlenecks: slow API calls, unnecessary re-renders, large bundles
- Use React DevTools Profiler for component rendering
- Add database indexes for frequently queried fields
- Implement caching strategies (frontend and backend)
- Lazy load images and code-split routes
- Monitor bundle size with `npm run build -- --analyze`

## Environment Variables & Configuration

### Backend Environment Setup
**Required `.env` file (add to `.gitignore`):**
```env
# Database
MONGO_URI=mongodb://localhost:27017/mobile-store
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mobile-store

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# CORS
CORS_ORIGIN=http://localhost:5173

# Optional: Email service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Validate env vars at startup:**
```javascript
const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
];

const missingVars = requiredVars.filter((v) => !process.env[v]);
if (missingVars.length) {
  throw new Error(`Missing env vars: ${missingVars.join(", ")}`);
}
```

### Frontend Environment Setup
**Create `.env.local` (add to `.gitignore`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Mobile Store
```

**Use in code:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
```

**Never:**
- Hardcode API URLs
- Expose API keys in frontend code
- Commit `.env` files to git
- Use secrets as strings in code

## Testing & Quality Assurance

### Manual Testing Checklist
**Core Functionality:**
- [ ] Register new account with validation
- [ ] Login with valid/invalid credentials
- [ ] Stay logged in after page refresh
- [ ] Logout clears auth state
- [ ] Browse products with pagination
- [ ] View product details
- [ ] Add/remove items from cart
- [ ] Update cart quantities
- [ ] Proceed to checkout
- [ ] Complete payment (sandbox mode)
- [ ] View order history
- [ ] Can't access admin routes without admin role

**Error Handling:**
- [ ] Show error on invalid login
- [ ] Show error on network failure
- [ ] Show error on server errors (500, 503)
- [ ] Retry button works
- [ ] Error messages are user-friendly

**Responsive Design:**
- [ ] Mobile (375px): single column layout, touch-friendly buttons
- [ ] Tablet (768px): two-column grids
- [ ] Desktop (1024px): three-column grids, full layout
- [ ] No horizontal scrolling
- [ ] Text is readable on all sizes

**Accessibility:**
- [ ] Can navigate with keyboard (Tab, Enter, Escape)
- [ ] Form inputs have associated labels
- [ ] Icon buttons have aria-labels
- [ ] Color contrast is sufficient (WCAG AA)
- [ ] Screen reader announces key content

**Performance:**
- [ ] Page loads in < 3 seconds on 4G
- [ ] Images load without layout shift
- [ ] Smooth animations (60fps)
- [ ] No console errors or warnings

### Code Quality Checklist
- [ ] No unused imports or variables
- [ ] Comments only for non-obvious logic
- [ ] Function names describe what they do
- [ ] Error messages are helpful to users
- [ ] No `console.log()` in production code
- [ ] No hardcoded values (use constants or env vars)
- [ ] All async operations handle errors
- [ ] No infinite loops or memory leaks

## Deployment Checklist

### Before Deploying
**Backend:**
- [ ] All env vars are set in production
- [ ] Database indices are created
- [ ] CORS is set to frontend domain only
- [ ] JWT_SECRET is strong (32+ chars, random)
- [ ] API keys (Razorpay) are production keys
- [ ] Error logs are configured
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are enabled
- [ ] Run `npm run build` equivalent for any build step

**Frontend:**
- [ ] API_BASE_URL points to production backend
- [ ] `npm run build` completes without errors
- [ ] No console errors in dev tools
- [ ] All environment variables are set
- [ ] Images/assets are optimized
- [ ] Bundle size is reasonable (< 500KB gzipped)

### Production Deployment
**Backend Deployment (Node.js hosting):**
```bash
# On deployment server
npm install --production
npm run build # If needed
npm start # Or use PM2: pm2 start server.js --name mobile-store
```

**Frontend Deployment (Static hosting):**
```bash
npm run build
# Deploy dist/ folder to Vercel, Netlify, or S3
```

**Post-Deployment:**
- [ ] Test all critical user flows in production
- [ ] Monitor error logs
- [ ] Check API response times
- [ ] Verify payment processing works
- [ ] Test email notifications (if implemented)
- [ ] Monitor database connection
- [ ] Set up uptime monitoring

### Security in Production
- [ ] HTTPS only (no HTTP)
- [ ] Database backups enabled
- [ ] API rate limiting prevents abuse
- [ ] Sensitive data is encrypted in database
- [ ] API keys are never exposed in frontend
- [ ] CORS is restricted to known domains
- [ ] Authentication tokens expire appropriately
- [ ] Password reset flow is secure
- [ ] Input validation on all endpoints
- [ ] SQL/NoSQL injection prevention
- [ ] XSS protection (Helmet CSP headers)
- [ ] CSRF protection (if using cookies)

## Common Development Patterns

### Adding a New Feature
1. **Design**: Plan the API contract (method, endpoint, request/response)
2. **Backend Model**: Create Mongoose schema with validation
3. **Backend Controller**: Implement business logic with error handling
4. **Backend Route**: Add route with auth/role middleware
5. **Test Backend**: Verify with Postman/curl
6. **Frontend Component**: Create React component with UI
7. **Frontend Service**: Add API call method
8. **Frontend Integration**: Connect component with service, handle states
9. **Test End-to-End**: Test full user flow
10. **Review**: Code review, test edge cases, verify accessibility

### Fixing Bugs
**Debugging Process:**
1. Reproduce the issue consistently
2. Check error logs: backend terminal, browser console, network tab
3. Add `console.log()` to isolate the problem
4. Check environment variables are set correctly
5. Test with different user roles/permissions if applicable
6. Verify database state with MongoDB client
7. Check for race conditions in async code
8. Fix at root cause, not symptoms
9. Add test case to prevent regression
10. Remove debug logs before committing

**Common Issues:**
- **401 Unauthorized**: Token expired, missing, or invalid
- **404 Not Found**: Wrong endpoint, resource doesn't exist
- **500 Error**: Unhandled exception in backend
- **CORS Error**: Frontend domain not in allowed origins
- **Blank screen**: Check browser console for errors
- **Slow page**: Check Network tab for slow API calls, large assets

### Performance Optimization
**Frontend:**
- Use React DevTools Profiler to find slow components
- Implement code splitting: `React.lazy(() => import('./Page'))`
- Cache API responses to avoid refetching
- Use `React.memo` for expensive list items
- Lazy load images: `<img loading="lazy" src="..." />`
- Minimize Tailwind CSS bundle with tree-shaking
- Monitor bundle size: `npm run build` shows gzipped size

**Backend:**
- Add database indexes on frequently queried fields
- Use `.lean()` for read-only queries
- Cache frequently accessed data (in-memory or Redis)
- Use pagination for large result sets
- Compress API responses with gzip
- Monitor API response times
- Use connection pooling for database

## Important Conventions

### DO
- ✅ Validate all user input (backend + frontend)
- ✅ Handle all error states (loading, error, success, empty)
- ✅ Use environment variables for secrets
- ✅ Write self-documenting code
- ✅ Test on mobile, tablet, and desktop
- ✅ Preserve backward compatibility when editing APIs
- ✅ Log errors for debugging (not success cases)
- ✅ Use semantic HTML for accessibility
- ✅ Optimize images before deploying
- ✅ Set up monitoring in production

### DON'T
- ❌ Modify existing API response format (breaks clients)
- ❌ Commit `.env` files or secrets to git
- ❌ Return passwords or API keys in responses
- ❌ Use inline styles instead of Tailwind
- ❌ Leave `console.log()` or `debugger` in code
- ❌ Suppress errors silently
- ❌ Use `any` type in TypeScript (if using TypeScript)
- ❌ Make synchronous API calls (always use async/await)
- ❌ Skip error handling in try-catch blocks
- ❌ Hardcode values that should be configurable

## Important Notes

- **Preserve API contracts**: Never change the `{success, message, data}` response format; it breaks all clients
- **Backward compatibility**: When editing controllers/models, maintain API compatibility for existing clients
- **Security first**: Never expose `JWT_SECRET`, `RAZORPAY_KEY_SECRET`, or API keys in code or frontend
- **Production-ready**: All code should include error handling, loading states, and proper validation
- **Scalability**: Structure components and services to handle feature additions without major refactoring
- **Clean code**: Write self-documenting code with minimal comments; comments should explain *why*, not *what*
- **Performance**: Always consider bundle size, API calls, and re-renders; profile before optimizing
- **Accessibility**: Semantic HTML and keyboard navigation are not optional—they're required
- **Testing**: Test on actual devices/browsers, not just dev tools; test edge cases and error states
- **Documentation**: Keep AGENTS.md and API_REFERENCE.md updated as APIs change

## Useful Links

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Express.js Guide](https://expressjs.com)
- [JWT Introduction](https://jwt.io/introduction)
