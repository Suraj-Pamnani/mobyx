const express = require("express");

const router = express.Router();


const {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    getCartTotal
}=require("../controllers/cartController");


const {
    protect
}=require("../middleware/authMiddleware");


router.get(
    "/total",
    protect,
    getCartTotal
);
router.post(
    "/add",
    protect,
    addToCart
);
router.get(
    "/",
    protect,
    getCart
);
router.put(
    "/update",
    protect,
    updateCart
);
router.delete(
    "/remove",
    protect,
    removeFromCart
);

module.exports = router;