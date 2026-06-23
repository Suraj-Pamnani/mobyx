# 🚀 Quick Start Guide - Mobile Store

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB running locally (or Atlas connection string)

### Step 1: Backend Setup

```bash
cd mobile-store-backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/mobile-store
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
PORT=5000
RAZORPAY_KEY_ID=rzp_test_1iBtlw9bLJxVEE
RAZORPAY_KEY_SECRET=your_razorpay_secret
CORS_ORIGIN=http://localhost:5173
EOF

# Start backend (with nodemon for development)
npm run dev
```

Backend will run on http://localhost:5000

### Step 2: Frontend Setup

```bash
cd mobile-store-frontend

# Install dependencies
npm install

# .env.local is already configured for local development

# Start frontend dev server
npm run dev
```

Frontend will run on http://localhost:5173

### Step 3: Test the App

**Demo Credentials:**
- Email: `demo@example.com`
- Password: `password123`

**Test Flow:**
1. Open http://localhost:5173
2. Login with demo credentials
3. Browse products
4. Add to cart
5. Proceed to checkout
6. Enter test address
7. Complete payment with Razorpay test key

### Step 4: Razorpay Test Mode

All payments use Razorpay test mode. No real charges.

**Test Card Numbers:**
- Visa: `4111111111111111`
- Mastercard: `5555555555554444`
- Expiry: Any future date
- CVV: Any 3 digits

## 📁 Project Structure

```
mobyx/
├── mobile-store-backend/     # Express server
│   ├── config/               # Database config
│   ├── controllers/          # Route handlers
│   ├── models/               # Mongoose schemas
│   ├── middleware/           # Auth, validation
│   ├── routes/               # API routes
│   ├── server.js             # Entry point
│   └── .env                  # Config (git-ignored)
│
└── mobile-store-frontend/    # React Vite app
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/            # Page components
    │   ├── services/         # API client
    │   ├── context/          # State management
    │   ├── hooks/            # Custom hooks
    │   ├── utils/            # Helpers
    │   ├── styles/           # Global styles
    │   └── App.jsx           # Main app
    ├── .env.local            # Config (git-ignored)
    ├── vite.config.js        # Vite config
    └── tailwind.config.js    # Tailwind config
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/mobile-store
JWT_SECRET=secret_key_minimum_32_characters_long
PORT=5000
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_1iBtlw9bLJxVEE
VITE_APP_NAME=Mobile Store
```

## 🎯 Available Scripts

### Backend
```bash
npm run dev      # Start with nodemon (development)
npm start        # Start in production mode
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Create production build
npm run preview  # Preview production build
npm run lint     # Lint code (if eslint configured)
```

## 🗄️ Database Setup

### Option 1: Local MongoDB
```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows with MongoDB
mongod

# Verify connection
mongo mongodb://localhost:27017/mobile-store
```

### Option 2: MongoDB Atlas (Cloud)
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update MONGO_URI in .env:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mobile-store
```

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Database connected (check backend terminal)
- [ ] Can login with demo credentials
- [ ] Can add product to cart
- [ ] Can proceed to checkout
- [ ] Razorpay modal opens on payment

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check port 5000 is free
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Check MongoDB is running
mongosh
```

### Frontend won't connect to backend
```bash
# Check VITE_API_BASE_URL in .env.local
# Should be: http://localhost:5000/api

# Check backend CORS in .env
# Should include: http://localhost:5173
```

### Razorpay errors
- Use test key (starts with `rzp_test_`)
- Use test card numbers (4111111111111111)
- Check VITE_RAZORPAY_KEY_ID matches backend

### CORS errors
- Ensure backend is running
- Verify CORS_ORIGIN in backend .env
- Clear browser cache if needed

## 📚 Documentation

- [Backend API Reference](./BACKEND_API_REFERENCE.md)
- [Frontend README](./mobile-store-frontend/FRONTEND_README.md)
- [Project Architecture](./AGENTS.md)

## 🚀 What's Next?

### Development
- Add more products via API
- Create admin dashboard
- Implement order tracking
- Add user profile management

### Production
- Deploy frontend to Vercel/Netlify
- Deploy backend to Railway/Heroku/AWS
- Configure production MongoDB
- Setup email notifications
- Configure production Razorpay keys

## 📞 Support

Check the detailed documentation in:
- `AGENTS.md` - Full project architecture
- `BACKEND_API_REFERENCE.md` - API endpoints
- `mobile-store-frontend/FRONTEND_README.md` - Frontend details

---

Happy coding! 🎉
