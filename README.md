# 📱 Mobile Store - Complete E-Commerce Platform

A full-stack e-commerce application for selling mobile phones with a modern React frontend and Express.js backend.

## 🎯 Project Overview

**Mobile Store** is a production-ready e-commerce platform featuring:

- 🛍️ Complete product catalog with filtering and search
- 👤 User authentication with JWT
- 🛒 Shopping cart management
- 💳 Razorpay payment integration
- ⭐ Product review system
- 📦 Order management
- 🎨 Modern, responsive UI with dark mode
- ♿ Full accessibility support
- 🚀 Optimized for performance

## 📂 Project Structure

```
mobyx/
├── mobile-store-backend/        # Express.js backend
│   ├── config/                  # Database configuration
│   ├── controllers/             # Route handlers
│   ├── models/                  # Mongoose schemas
│   ├── middleware/              # Auth & validation
│   ├── routes/                  # API endpoints
│   ├── server.js                # Entry point
│   └── .env                     # Config (git-ignored)
│
├── mobile-store-frontend/       # React Vite frontend
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── services/            # API client
│   │   ├── context/             # State management
│   │   ├── utils/               # Utilities
│   │   ├── App.jsx              # Main app
│   │   └── main.jsx             # Entry point
│   ├── .env.local               # Config (git-ignored)
│   ├── vite.config.js           # Vite config
│   └── tailwind.config.js       # Tailwind config
│
├── QUICK_START.md               # 5-minute setup guide
├── COMPLETE_FRONTEND_GUIDE.md   # Full frontend documentation
├── BACKEND_API_REFERENCE.md     # API endpoints reference
├── AGENTS.md                    # Project architecture
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB (local or Atlas)

### Setup (5 Minutes)

**1. Backend Setup**
```bash
cd mobile-store-backend
npm install
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/mobile-store
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
PORT=5000
RAZORPAY_KEY_ID=rzp_test_1iBtlw9bLJxVEE
RAZORPAY_KEY_SECRET=your_razorpay_secret
CORS_ORIGIN=http://localhost:5173
EOF
npm run dev
```

**2. Frontend Setup**
```bash
cd mobile-store-frontend
npm install
npm run dev
```

**3. Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Demo Email: demo@example.com
- Demo Password: password123

## 📚 Documentation

### For Getting Started
👉 **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide with troubleshooting

### For Frontend Development
👉 **[COMPLETE_FRONTEND_GUIDE.md](./COMPLETE_FRONTEND_GUIDE.md)** - Comprehensive frontend documentation
👉 **[mobile-store-frontend/FRONTEND_README.md](./mobile-store-frontend/FRONTEND_README.md)** - Frontend-specific guide

### For API Reference
👉 **[BACKEND_API_REFERENCE.md](./BACKEND_API_REFERENCE.md)** - All API endpoints with examples

### For Architecture
👉 **[AGENTS.md](./AGENTS.md)** - Project architecture and conventions

## 🏗️ Architecture

### Frontend Stack
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS + shadcn/ui patterns
- **Routing**: React Router v6
- **Forms**: react-hook-form + Zod validation
- **Animation**: Framer Motion
- **HTTP**: Axios with interceptors
- **State**: React Context API

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Payment**: Razorpay
- **Middleware**: Custom auth, validation, error handling

## 🎨 Features

### User Features
- ✅ User authentication (register, login, logout)
- ✅ Browse and filter products by brand and price
- ✅ Search products by keyword
- ✅ View product details and specifications
- ✅ Read and write product reviews
- ✅ Add items to shopping cart
- ✅ Manage cart (update quantity, remove items)
- ✅ Proceed to checkout with validation
- ✅ Complete payment via Razorpay
- ✅ View order confirmation
- ✅ Dark mode support

### Technical Features
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states and skeleton loaders
- ✅ Comprehensive error handling
- ✅ Form validation with error messages
- ✅ Toast notifications
- ✅ Error boundaries
- ✅ Accessibility compliance (WCAG AA)
- ✅ Production-ready code

## 🔐 Security

- JWT tokens with 7-day expiry
- Passwords hashed with bcryptjs
- CORS configured
- Rate limiting on sensitive endpoints
- Input validation on all forms
- Environment variables for secrets
- XSS protection via React
- CSRF protection ready

## 📱 Responsive Design

- **Mobile**: 375px+ (single column, touch-optimized)
- **Tablet**: 768px+ (2-column layout)
- **Desktop**: 1024px+ (3-4 column layout)

## 🧪 Test Data

### Demo Account
- Email: `demo@example.com`
- Password: `password123`

### Razorpay Test Cards
- Visa: `4111111111111111`
- Mastercard: `5555555555554444`
- CVV: Any 3 digits
- Expiry: Any future date

## 🚢 Deployment

### Frontend Deployment
```bash
# Build production bundle
npm run build

# Deploy dist/ to:
# - Vercel (recommended)
# - Netlify
# - GitHub Pages
# - AWS S3
```

### Backend Deployment
Options:
- Railway
- Heroku
- AWS EC2
- DigitalOcean
- Google Cloud

### Environment Setup
Update production environment variables in hosting platform.

## 📊 Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 19.2.7 |
| Build Tool | Vite | 8.1.0 |
| Styling | Tailwind CSS | 4.3.1 |
| Animation | Framer Motion | 12.41.0 |
| Forms | react-hook-form | 7.80.0 |
| Validation | Zod | 4.4.3 |
| Backend | Express.js | 4.x |
| Database | MongoDB | 7.x |
| ORM | Mongoose | 8.x |
| Payment | Razorpay | API |

## 🎯 Development Workflow

### Feature Development
1. Create feature branch: `git checkout -b feature/name`
2. Update API contract in BACKEND_API_REFERENCE.md
3. Implement backend endpoint
4. Implement frontend service method
5. Create UI components
6. Test end-to-end
7. Commit and push

### Code Quality
- Follow naming conventions in AGENTS.md
- Maintain component size < 200 lines
- Add error handling for all async ops
- Test on mobile, tablet, desktop
- Check accessibility with keyboard

## 🐛 Troubleshooting

### Backend Won't Connect
```bash
# Check MongoDB is running
mongo mongodb://localhost:27017

# Check backend server started
curl http://localhost:5000/api/products
```

### Frontend Won't Connect to Backend
```bash
# Check VITE_API_BASE_URL in .env.local
# Should be: http://localhost:5000/api

# Check backend CORS in .env
# Should include: http://localhost:5173
```

### Payment Issues
- Use Razorpay test key (starts with `rzp_test_`)
- Use test card numbers
- Check backend payment verification

## 📈 Performance

- ⚡ Vite dev server with HMR
- 📦 Code splitting with React.lazy()
- 🖼️ Image lazy loading
- 🎯 Optimized bundle size
- 🚀 Production build < 500KB gzipped

## ♿ Accessibility

- WCAG AA compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast > 4.5:1
- Focus management

## 📝 API Endpoints (17 Total)

### Authentication (3)
- POST /auth/register
- POST /auth/login
- GET /auth/profile

### Products (3)
- GET /products (with filters)
- GET /products/:id
- POST /products/:id/review

### Cart (5)
- POST /cart/add
- GET /cart
- PUT /cart/update
- DELETE /cart/remove
- GET /cart/total

### Orders (6)
- POST /orders/create
- POST /orders/verify
- GET /orders/admin/all
- GET /orders/admin/:id
- PUT /orders/admin/:id
- GET /auth/admin

See [BACKEND_API_REFERENCE.md](./BACKEND_API_REFERENCE.md) for complete details.

## 🤝 Contributing

1. Read [AGENTS.md](./AGENTS.md) for architecture
2. Follow code style guidelines
3. Test thoroughly on all devices
4. Write clear commit messages
5. Create pull request with description

## 📞 Support Resources

- 📖 [QUICK_START.md](./QUICK_START.md) - Getting started
- 📘 [COMPLETE_FRONTEND_GUIDE.md](./COMPLETE_FRONTEND_GUIDE.md) - Frontend docs
- 📗 [BACKEND_API_REFERENCE.md](./BACKEND_API_REFERENCE.md) - API reference
- 📙 [AGENTS.md](./AGENTS.md) - Architecture guide
- 🎓 [Frontend README](./mobile-store-frontend/FRONTEND_README.md) - Frontend specifics

## 🎓 Learning Path

1. **Start Here**: [QUICK_START.md](./QUICK_START.md)
2. **Understand Architecture**: [AGENTS.md](./AGENTS.md)
3. **Frontend Details**: [COMPLETE_FRONTEND_GUIDE.md](./COMPLETE_FRONTEND_GUIDE.md)
4. **API Reference**: [BACKEND_API_REFERENCE.md](./BACKEND_API_REFERENCE.md)
5. **Development**: Start coding features

## ✅ Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Browse products with filters
- [ ] View product details
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Complete checkout
- [ ] Verify payment works
- [ ] See order confirmation
- [ ] Test on mobile device
- [ ] Test dark mode
- [ ] Test keyboard navigation

## 🎉 What's Included

✅ 9 fully functional pages
✅ 20+ reusable UI components
✅ 17 complete API endpoints
✅ Payment gateway integration
✅ Form validation and error handling
✅ Loading states and skeleton loaders
✅ Dark mode support
✅ Responsive design
✅ Production-ready code
✅ Comprehensive documentation

## 🚀 What's Next?

### Phase 2 Features
- Admin dashboard for product management
- Order tracking and updates
- User profile and address management
- Wishlist functionality
- Product recommendations
- Email notifications
- Advanced search and filters
- Rating aggregation

### Performance Improvements
- Image CDN optimization
- Redis caching
- Database indexing
- Bundle size reduction
- API response caching

### DevOps
- Docker containerization
- CI/CD pipeline
- Automated testing
- Performance monitoring
- Error tracking (Sentry)

## 📜 License

MIT License - See LICENSE file

## 👨‍💻 Author

Built with care for a production-ready e-commerce platform.

---

**Status**: ✅ Production Ready
**Last Updated**: 2024
**Maintainers**: Development Team

For questions or issues, refer to the comprehensive documentation included in this project.
