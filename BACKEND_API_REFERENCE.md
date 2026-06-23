# Mobile Store Backend - Complete API Reference

**Base URL:** `http://localhost:5000`  
**API Prefix:** `/api`

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Product Endpoints](#product-endpoints)
3. [Cart Endpoints](#cart-endpoints)
4. [Order Endpoints](#order-endpoints)
5. [Database Schemas](#database-schemas)
6. [Authentication & Middleware](#authentication--middleware)
7. [Error Handling](#error-handling)
8. [Status Codes](#status-codes)

---

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register`  
**Authentication:** None  
**Status Code:** 201 (Created) or 400/500 (Error)

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique, lowercase)",
  "password": "string (required)"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "ObjectId",
    "name": "string",
    "email": "string",
    "password": "string (hashed with bcryptjs, 10 rounds)",
    "role": "customer (default)",
    "isVerified": false,
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "message": "error.message"
}
```

**Validation Rules:**
- Name: Required, string
- Email: Required, unique, case-insensitive
- Password: Required, hashed using bcryptjs (10 salt rounds)
- Role: Auto-set to "customer"
- isVerified: Auto-set to false

---

### 2. Login User
**Endpoint:** `POST /api/auth/login`  
**Authentication:** None  
**Status Code:** 200 (Success) or 401/500 (Error)

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login Successful",
  "token": "JWT token (expires in 7 days)",
  "user": {
    "id": "ObjectId",
    "name": "string",
    "email": "string",
    "role": "customer | admin"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid Email or Password"
}
```

**JWT Token Contents:**
```json
{
  "id": "user._id",
  "role": "customer | admin",
  "iat": "issued at time",
  "exp": "expires in 7 days"
}
```

**Authentication Header Format:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 3. Get User Profile
**Endpoint:** `GET /api/auth/profile`  
**Authentication:** Required (Bearer Token)  
**Status Code:** 200 (Success) or 401/500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "_id": "ObjectId",
    "name": "string",
    "email": "string",
    "role": "customer | admin",
    "isVerified": "boolean",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Note:** Password field is excluded (`.select("-password")`)

---

### 4. Admin Access Test
**Endpoint:** `GET /api/auth/admin`  
**Authentication:** Required (Bearer Token)  
**Authorization:** Admin role required  
**Status Code:** 200 (Success) or 401/403 (Error)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Welcome Admin"
}
```

**Response (Error - 403 - Not Admin):**
```json
{
  "success": false,
  "message": "Admin Access Required"
}
```

---

## Product Endpoints

### 1. Create Product (Admin Only)
**Endpoint:** `POST /api/products`  
**Authentication:** Required (Bearer Token)  
**Authorization:** Admin role required  
**Status Code:** 201 (Created) or 403/500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "brand": "string (required)",
  "modelName": "string (required)",
  "price": "number (required)",
  "stock": "number (required, default: 0)",
  "description": "string (required)",
  "images": ["string (URLs)"],
  "specifications": {
    "ram": "string",
    "storage": "string",
    "processor": "string",
    "display": "string",
    "battery": "string",
    "camera": "string"
  }
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "product": {
    "_id": "ObjectId",
    "brand": "string",
    "modelName": "string",
    "price": "number",
    "stock": "number",
    "description": "string",
    "images": ["string"],
    "specifications": {
      "ram": "string",
      "storage": "string",
      "processor": "string",
      "display": "string",
      "battery": "string",
      "camera": "string"
    },
    "reviews": [],
    "numReviews": 0,
    "rating": 0,
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

---

### 2. Get All Products (Public)
**Endpoint:** `GET /api/products`  
**Authentication:** Not required  
**Status Code:** 200 (Success) or 500 (Error)

**Query Parameters:**
```
?keyword=string          (search by modelName, case-insensitive regex)
&brand=string            (filter by brand exact match)
&minPrice=number         (filter products >= minPrice)
&maxPrice=number         (filter products <= maxPrice)
&page=number             (default: 1)
&limit=number            (default: 5)
```

**Response (Success - 200):**
```json
{
  "success": true,
  "totalProducts": "number",
  "currentPage": "number",
  "products": [
    {
      "_id": "ObjectId",
      "brand": "string",
      "modelName": "string",
      "price": "number",
      "stock": "number",
      "description": "string",
      "images": ["string"],
      "specifications": {
        "ram": "string",
        "storage": "string",
        "processor": "string",
        "display": "string",
        "battery": "string",
        "camera": "string"
      },
      "reviews": ["array of review objects"],
      "numReviews": "number",
      "rating": "number (average of all reviews)",
      "createdAt": "ISO 8601 timestamp",
      "updatedAt": "ISO 8601 timestamp"
    }
  ]
}
```

**Example Requests:**
```
GET /api/products?keyword=iPhone&brand=Apple&minPrice=10000&maxPrice=50000&page=1&limit=10
GET /api/products?brand=Samsung
GET /api/products?minPrice=5000&maxPrice=20000
GET /api/products?page=2&limit=15
```

---

### 3. Get Single Product
**Endpoint:** `GET /api/products/:id`  
**Authentication:** Not required  
**URL Parameters:** `id` (ObjectId)  
**Status Code:** 200 (Success) or 404/500 (Error)

**Response (Success - 200):**
```json
{
  "success": true,
  "product": {
    "_id": "ObjectId",
    "brand": "string",
    "modelName": "string",
    "price": "number",
    "stock": "number",
    "description": "string",
    "images": ["string"],
    "specifications": {
      "ram": "string",
      "storage": "string",
      "processor": "string",
      "display": "string",
      "battery": "string",
      "camera": "string"
    },
    "reviews": [
      {
        "user": "ObjectId",
        "name": "string",
        "rating": "number",
        "comment": "string",
        "createdAt": "ISO 8601 timestamp"
      }
    ],
    "numReviews": "number",
    "rating": "number",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 4. Create Product Review (Protected)
**Endpoint:** `POST /api/products/:id/review`  
**Authentication:** Required (Bearer Token)  
**URL Parameters:** `id` (ObjectId - Product ID)  
**Status Code:** 201 (Created) or 400/404/500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "rating": "number (required)",
  "comment": "string (required)"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Review Added"
}
```

**Response (Error - 400 - Already Reviewed):**
```json
{
  "success": false,
  "message": "Already reviewed"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**Business Logic:**
- User can only review each product once
- Review object stored in product.reviews array:
  ```json
  {
    "user": "user._id",
    "name": "user.name",
    "rating": "number",
    "comment": "string",
    "createdAt": "current date"
  }
  ```
- Product rating is auto-calculated: `(sum of all ratings) / numReviews`
- Product numReviews is updated to `reviews.length`

---

## Cart Endpoints

### 1. Add Product to Cart (Protected)
**Endpoint:** `POST /api/cart/add`  
**Authentication:** Required (Bearer Token)  
**Status Code:** 200 (Success) or 500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "productId": "ObjectId (required)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "cart": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "items": [
      {
        "product": "ObjectId",
        "quantity": "number",
        "_id": "ObjectId"
      }
    ],
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Business Logic:**
- If cart doesn't exist for user, create new cart with initial item quantity = 1
- If cart exists:
  - If product already in cart, increment quantity by 1
  - If product not in cart, add with quantity = 1
- Returns full cart object after operation

---

### 2. Get User Cart (Protected)
**Endpoint:** `GET /api/cart`  
**Authentication:** Required (Bearer Token)  
**Status Code:** 200 (Success) or 500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (Success - 200, Cart Exists):**
```json
{
  "success": true,
  "cart": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "items": [
      {
        "product": {
          "_id": "ObjectId",
          "brand": "string",
          "modelName": "string",
          "price": "number",
          "stock": "number",
          "description": "string",
          "images": ["string"],
          "specifications": {},
          "reviews": [],
          "numReviews": "number",
          "rating": "number",
          "createdAt": "ISO 8601 timestamp",
          "updatedAt": "ISO 8601 timestamp"
        },
        "quantity": "number",
        "_id": "ObjectId"
      }
    ],
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Response (Success - 200, Cart Empty or Not Found):**
```json
{
  "success": true,
  "items": []
}
```

**Business Logic:**
- Uses `.populate("items.product")` to return full product details
- Returns empty array if no cart found

---

### 3. Update Cart Item Quantity (Protected)
**Endpoint:** `PUT /api/cart/update`  
**Authentication:** Required (Bearer Token)  
**Status Code:** 200 (Success) or 404/500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "productId": "ObjectId (required)",
  "quantity": "number (required)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "cart": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "items": [
      {
        "product": "ObjectId",
        "quantity": "number (updated)",
        "_id": "ObjectId"
      }
    ],
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Response (Error - 404, Cart Not Found):**
```json
{
  "success": false,
  "message": "Cart not found"
}
```

**Response (Error - 404, Product Not In Cart):**
```json
{
  "success": false,
  "message": "Product not in cart"
}
```

---

### 4. Remove Product from Cart (Protected)
**Endpoint:** `DELETE /api/cart/remove`  
**Authentication:** Required (Bearer Token)  
**Status Code:** 200 (Success) or 404/500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "productId": "ObjectId (required)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Product removed from cart",
  "cart": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "items": [
      {
        "product": "ObjectId",
        "quantity": "number",
        "_id": "ObjectId"
      }
    ],
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Cart not found"
}
```

**Business Logic:**
- Filters out the product from cart.items array
- If cart becomes empty, still returns success (empty items array)

---

### 5. Get Cart Total (Protected)
**Endpoint:** `GET /api/cart/total`  
**Authentication:** Required (Bearer Token)  
**Status Code:** 200 (Success) or 404/500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "totalAmount": "number",
  "cart": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "items": [
      {
        "product": {
          "_id": "ObjectId",
          "price": "number",
          "...": "...product fields..."
        },
        "quantity": "number",
        "_id": "ObjectId"
      }
    ],
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Cart not found"
}
```

**Calculation:** `totalAmount = sum(item.product.price * item.quantity for all items)`

---

## Order Endpoints

### 1. Create Order (Protected)
**Endpoint:** `POST /api/orders/create`  
**Authentication:** Required (Bearer Token)  
**Status Code:** 200 (Success) or 400/500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "address": {
    "address": "string (required)",
    "city": "string (required)",
    "state": "string (required)",
    "pincode": "string (required)"
  }
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "orderId": "ObjectId",
  "razorpayOrder": {
    "id": "order_XXXXX (Razorpay Order ID)",
    "entity": "order",
    "amount": "number (in paise, total * 100)",
    "amount_paid": 0,
    "amount_due": "number",
    "currency": "INR",
    "receipt": "ObjectId (order._id)",
    "offer_id": null,
    "status": "created",
    "attempts": 0,
    "notes": {},
    "created_at": "unix timestamp"
  }
}
```

**Response (Error - 400, Empty Cart):**
```json
{
  "message": "Cart is empty"
}
```

**Business Logic:**
1. Fetch user's cart with product details
2. Calculate total: `sum(product.price * quantity for all items)`
3. Create Order in DB with:
   - user: req.user.id
   - products: array of {product._id, quantity, price}
   - totalAmount: calculated total
   - shippingAddress: from request
   - paymentStatus: "Pending" (default)
   - orderStatus: "Processing" (default)
4. Create Razorpay Order with amount in paise (total * 100)
5. Return both Order._id and Razorpay Order object

---

### 2. Verify Payment (Protected)
**Endpoint:** `POST /api/orders/verify`  
**Authentication:** Required (Bearer Token)  
**Status Code:** 200 (Success) or 400/404/500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "razorpay_order_id": "string (required)",
  "razorpay_payment_id": "string (required)",
  "razorpay_signature": "string (required)",
  "orderId": "ObjectId (required - our internal order ID)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Payment Verified Successfully"
}
```

**Response (Error - 400, Signature Mismatch):**
```json
{
  "success": false,
  "message": "Payment Verification Failed"
}
```

**Response (Error - 404, Order Not Found):**
```json
{
  "success": false,
  "message": "Order Not Found"
}
```

**Security & Business Logic:**
1. Verify Razorpay signature using HMAC-SHA256:
   ```
   generatedSignature = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, RAZORPAY_KEY_SECRET)
   if generatedSignature !== razorpay_signature -> return error
   ```
2. If signature valid:
   - Update Order: paymentStatus = "Paid", razorpayPaymentId = razorpay_payment_id
   - Reduce product stock for each order item:
     ```
     for each item in order.products:
       product.stock -= item.quantity
       product.save()
     ```
   - Save order
   - Clear user's cart: `cart.items = []`
   - Return success

---

### 3. Get All Orders (Admin Only)
**Endpoint:** `GET /api/orders/admin/all`  
**Authentication:** Required (Bearer Token)  
**Authorization:** Admin role required  
**Status Code:** 200 (Success) or 401/403/500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "count": "number",
  "orders": [
    {
      "_id": "ObjectId",
      "user": {
        "_id": "ObjectId",
        "name": "string",
        "email": "string"
      },
      "products": [
        {
          "product": {
            "_id": "ObjectId",
            "brand": "string",
            "modelName": "string",
            "price": "number",
            "...": "...product fields..."
          },
          "quantity": "number",
          "price": "number",
          "_id": "ObjectId"
        }
      ],
      "totalAmount": "number",
      "shippingAddress": {
        "address": "string",
        "city": "string",
        "state": "string",
        "pincode": "string"
      },
      "paymentStatus": "string (Pending|Paid)",
      "razorpayPaymentId": "string",
      "orderStatus": "string (Processing|Shipped|Delivered)",
      "createdAt": "ISO 8601 timestamp",
      "updatedAt": "ISO 8601 timestamp"
    }
  ]
}
```

---

### 4. Update Order Status (Admin Only)
**Endpoint:** `PUT /api/orders/admin/:id`  
**Authentication:** Required (Bearer Token)  
**Authorization:** Admin role required  
**URL Parameters:** `id` (ObjectId - Order ID)  
**Status Code:** 200 (Success) or 404/500 (Error)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "status": "string (Processing|Shipped|Delivered)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "order": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "products": [
      {
        "product": "ObjectId",
        "quantity": "number",
        "price": "number",
        "_id": "ObjectId"
      }
    ],
    "totalAmount": "number",
    "shippingAddress": {
      "address": "string",
      "city": "string",
      "state": "string",
      "pincode": "string"
    },
    "paymentStatus": "string",
    "razorpayPaymentId": "string",
    "orderStatus": "string (updated)",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

## Database Schemas

### User Schema
```javascript
{
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  brand: {
    type: String,
    required: true
  },
  modelName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  images: [
    {
      type: String
    }
  ],
  specifications: {
    ram: String,
    storage: String,
    processor: String,
    display: String,
    battery: String,
    camera: String
  },
  reviews: [
    {
      user: ObjectId (ref: "User"),
      name: String,
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  numReviews: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Schema
```javascript
{
  user: {
    type: ObjectId (ref: "User"),
    required: true
  },
  items: [
    {
      product: {
        type: ObjectId (ref: "Product"),
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  user: {
    type: ObjectId (ref: "User"),
    required: true
  },
  products: [
    {
      product: ObjectId (ref: "Product"),
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentStatus: {
    type: String,
    default: "Pending"
  },
  razorpayPaymentId: String,
  orderStatus: {
    type: String,
    default: "Processing"
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication & Middleware

### Protect Middleware
**File:** `middleware/authMiddleware.js`

**Function:** `protect(req, res, next)`

**Process:**
1. Extract token from `Authorization: Bearer <token>` header
2. If no token provided → return 401 "Access Denied. No Token Provided"
3. Verify token using `JWT_SECRET` environment variable
4. On successful verification:
   - Decode token
   - Set `req.user = decoded` (contains `id` and `role`)
   - Call `next()`
5. On verification failure → return 401 "Invalid Token"

**Error Responses:**
- 401: No token provided
- 401: Invalid token

---

### Admin Middleware
**Function:** `admin(req, res, next)`

**Process:**
1. Check if `req.user.role === "admin"`
2. If not admin → return 403 "Admin Access Required"
3. If admin → call `next()`

**Note:** Must be used after `protect` middleware

**Error Response:**
- 403: User is not admin

---

### JWT Token Structure
```javascript
{
  id: "user._id",
  role: "customer | admin"
}
```

**Token Expiration:** 7 days  
**Secret Key:** `process.env.JWT_SECRET`

---

## Error Handling

### Standard Error Response Format
All error responses follow this format:

```json
{
  "success": false,
  "message": "error description"
}
```

### Common Error Messages
| Error | Status | Message |
|-------|--------|---------|
| User already exists | 400 | "User already exists" |
| Invalid credentials | 401 | "Invalid Email or Password" |
| No token provided | 401 | "Access Denied. No Token Provided" |
| Invalid token | 401 | "Invalid Token" |
| Not admin | 403 | "Admin Access Required" |
| Product not found | 404 | "Product not found" |
| Cart not found | 404 | "Cart not found" |
| Product not in cart | 404 | "Product not in cart" |
| Order not found | 404 | "Order Not Found" |
| Already reviewed | 400 | "Already reviewed" |
| Cart is empty | 400 | "Cart is empty" |
| Payment verification failed | 400 | "Payment Verification Failed" |
| Server error | 500 | Error message from catch block |

---

## Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE operations |
| 201 | Created | Successful POST operations (register, create product/review) |
| 400 | Bad Request | Invalid input, duplicate user, empty cart, payment verification failed |
| 401 | Unauthorized | Invalid credentials, missing/invalid token |
| 403 | Forbidden | Non-admin trying to access admin-only endpoint |
| 404 | Not Found | Product/cart/order/user not found |
| 500 | Internal Server Error | Unhandled exceptions, database errors |

---

## Required Environment Variables

```bash
# Database
MONGO_URI=mongodb://username:password@host:port/database

# Authentication
JWT_SECRET=your_secret_key_here

# Server
PORT=5000

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## Middleware Application Order

**Protected Routes (User must be authenticated):**
```
protect -> controller
```

**Admin Routes (User must be authenticated and admin):**
```
protect -> admin -> controller
```

**Public Routes:**
```
controller (no middleware)
```

---

## Additional Notes

1. **Password Hashing:** Uses bcryptjs with 10 salt rounds
2. **Database Connection:** Mongoose with auto-timestamps (createdAt, updatedAt)
3. **Pagination:** Default limit is 5, customizable via query params
4. **Product Filtering:** Supports keyword (regex), brand (exact), and price range
5. **Review Calculation:** Product rating is average of all review ratings
6. **Stock Management:** Decremented only after payment verification
7. **Cart Clearing:** Automatically cleared after successful payment
8. **API Prefix:** All endpoints prefixed with `/api`
9. **CORS:** Not explicitly configured (may need to add for frontend deployment)
10. **Request Validation:** Mongoose schema validation for create operations
