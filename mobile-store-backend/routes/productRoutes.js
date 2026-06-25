const express = require("express");

const router = express.Router();


const {
    createProduct,
    getProducts,
    getSingleProduct,
    createReview,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");


const {
    protect,
    admin
} = require("../middleware/authMiddleware");


// Admin create product

router.post(
    "/",
    protect,
    admin,
    createProduct
);

router.post(
    "/:id/review",
    protect,
    createReview
);
// Customer view products

router.get(
    "/",
    getProducts
);
router.get(
    "/:id",
    getSingleProduct
);

// Admin update/delete product
router.put(
    "/:id",
    protect,
    admin,
    updateProduct
);

router.delete(
    "/:id",
    protect,
    admin,
    deleteProduct
);

module.exports = router;