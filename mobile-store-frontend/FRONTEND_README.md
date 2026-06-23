# Mobile Store - Frontend

A production-ready React e-commerce frontend built with Vite, Tailwind CSS, and modern JavaScript. Integrates with the Express.js backend and Razorpay payment gateway.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design inspired by Stripe, Vercel, and Linear
- **Complete E-Commerce Flow**: Browse, filter, review products, cart management, checkout
- **Authentication**: JWT-based auth with protected routes
- **Payment Integration**: Razorpay payment gateway integration
- **State Management**: React Context API for auth and cart
- **Form Validation**: react-hook-form + Zod for robust validation
- **Loading States**: Skeleton loaders, spinners, empty states
- **Error Handling**: Comprehensive error boundaries and toast notifications
- **Dark Mode**: Full dark mode support
- **Responsive**: Mobile, tablet, and desktop optimized
- **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels
- **Performance**: Code splitting, lazy loading, optimized images

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Backend running on `http://localhost:5000`

## 🔧 Installation

```bash
# Install dependencies
npm install

# Create .env.local file with your configuration
cp .env.example .env.local
```

## ⚙️ Configuration

Update `.env.local` with your settings:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api

# Razorpay Test Key (get from https://dashboard.razorpay.com)
VITE_RAZORPAY_KEY_ID=rzp_test_1iBtlw9bLJxVEE

# App Name
VITE_APP_NAME=Mobile Store
```

## 🏃 Running the App

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` with HMR enabled.

### Production Build

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Login, Register, Protected Routes
│   ├── cart/              # Cart components
│   ├── checkout/          # Checkout form
│   ├── common/            # Reusable UI components
│   ├── layout/            # Header, Footer
│   ├── product/           # Product cards, grid
│   └── ui/                # Skeleton, Empty state, Error boundary
├── context/
│   ├── AuthContext.jsx    # Auth state management
│   └── CartContext.jsx    # Cart state management
├── hooks/
│   ├── useAuth.js         # Auth hook
│   ├── useCart.js         # Cart hook
│   └── useFetch.js        # Data fetching hook
├── pages/
│   ├── Home.jsx           # Homepage with hero and featured products
│   ├── Products.jsx       # Product listing with filters
│   ├── ProductDetail.jsx  # Product details and reviews
│   ├── Cart.jsx           # Shopping cart management
│   ├── Checkout.jsx       # Checkout and payment
│   ├── OrderConfirmation.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── NotFound.jsx       # 404 page
├── services/
│   ├── api.js             # Axios config with interceptors
│   └── index.js           # API service methods
├── styles/
│   ├── globals.css
│   └── animations.css
├── utils/
│   ├── constants.js       # App constants
│   ├── format.js          # Formatting utilities
│   └── validation.js      # Zod validation schemas
└── App.jsx                # Main app with routing
```

## 🎨 Design System

### Colors

- **Primary**: `primary-600` (Sky Blue) - Interactive elements, CTA
- **Semantic**: Success (green), Warning (amber), Danger (red)
- **Neutral**: Slate colors for backgrounds and text

### Typography

- Font: Inter system font stack
- Sizes: sm (12px), base (14px), lg (16px), xl (20px), 2xl (24px)
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)

### Components

All components are built with:
- Tailwind CSS for styling
- Framer Motion for animations
- shadcn/ui design patterns
- Accessibility-first approach

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. API interceptor adds token to all requests
5. On 401, token is cleared and user redirected to login
6. Protected routes check user state

## 🛒 Cart Management

- Cart persisted via API (server-side)
- Real-time updates after add/remove/update
- Quantity validation
- Stock checking
- Automatic tax and shipping calculation

## 💳 Payment Flow

1. User enters shipping address
2. Order created on backend, receives Razorpay order ID
3. Razorpay payment modal opens
4. User completes payment
5. Payment signature verified on backend
6. Stock updated, order confirmed
7. User redirected to order confirmation page

## 📱 Responsive Breakpoints

- Mobile: < 640px (`sm:`)
- Tablet: 640px - 1024px (`md:`, `lg:`)
- Desktop: > 1024px (`xl:`)

## 🎯 Key Features Implementation

### Product Filtering

- Search by keyword
- Filter by brand
- Filter by price range
- Pagination (12 items per page)

### Product Reviews

- Users can add reviews after login
- 5-star rating system
- Review text
- Average rating calculated
- Reviews displayed on product detail page

### Cart Operations

- Add items with quantity
- Update quantity
- Remove items
- View cart total with tax and shipping
- Real-time calculations

### Checkout Validation

- Form validation with error messages
- Address validation
- Phone number validation
- Email verification

## 🚀 Performance Optimizations

- Code splitting with React.lazy()
- Image lazy loading
- Bundle size monitoring
- Tree-shaking unused code
- Minification and compression
- Caching strategies

## ♿ Accessibility

- Semantic HTML tags
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast > WCAG AA
- Screen reader support
- Focus management

## 🧪 Testing Checklist

- [ ] User registration and login
- [ ] Product browsing and filtering
- [ ] Product details and reviews
- [ ] Add to cart functionality
- [ ] Cart updates and checkout
- [ ] Payment processing
- [ ] Order confirmation
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode toggle
- [ ] Error handling

## 🐛 Common Issues

### CORS Errors
- Ensure backend is running on port 5000
- Check `VITE_API_BASE_URL` is correct
- Backend CORS settings include localhost:5173

### Payment Issues
- Verify Razorpay test key is correct
- Check backend payment verification logic
- Network tab to see payment requests

### Authentication Issues
- Check token is being stored in localStorage
- Verify JWT secret matches backend
- Check token expiry (7 days)

## 📚 Dependencies

### Core
- `react` - UI framework
- `react-router-dom` - Routing
- `react-hook-form` - Form management
- `zod` - Schema validation
- `axios` - HTTP client

### UI & Animation
- `tailwindcss` - Styling
- `framer-motion` - Animations
- `lucide-react` - Icons
- `react-hot-toast` - Notifications

## 🚢 Deployment

### Frontend Hosting Options
- Vercel (recommended for Vite)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Pre-deployment

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Check bundle size
npm run build -- --analyze

# Lint code
npm run lint
```

### Environment Variables (Production)

Set these in your hosting platform's environment settings:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_RAZORPAY_KEY_ID=rzp_live_xxxx
```

## 📖 API Integration

All API calls go through `src/services/index.js`:

```javascript
// Auth
authService.register()
authService.login()
authService.getProfile()

// Products
productService.getAllProducts()
productService.getProductById()
productService.addReview()

// Cart
cartService.addToCart()
cartService.getCart()
cartService.updateCart()
cartService.removeFromCart()

// Orders
orderService.createOrder()
orderService.verifyPayment()
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes following code style
3. Test thoroughly
4. Commit with clear messages
5. Push and create pull request

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check documentation in AGENTS.md
2. Review backend BACKEND_API_REFERENCE.md
3. Check browser console for errors
4. Review Network tab for API calls

---

Built with ❤️ using React, Vite, and Tailwind CSS
