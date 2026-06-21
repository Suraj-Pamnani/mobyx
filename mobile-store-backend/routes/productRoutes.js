const express = require("express");

const router = express.Router();


const {
    createProduct,
    getProducts,
    getSingleProduct,
    createReview
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

module.exports = router;