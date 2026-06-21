const express=require("express");

const router=express.Router();

// const {
//     createOrder,
//     verifyPayment,
//     getMyOrders
// } = require("../controllers/orderController");


// const {
// protect
// }=require("../middleware/authMiddleware");

const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const {
  protect,
  admin
} = require("../middleware/authMiddleware");

router.post(
"/create",
protect,
createOrder
);
router.get(
  "/admin/all",
  protect,
  admin,
  getAllOrders
);

router.put(
  "/admin/:id",
  protect,
  admin,
  updateOrderStatus
);
router.post(
    "/verify",
    protect,
    verifyPayment
);
// router.get(
//     "/myorders",
//     protect,
//     getMyOrders
// );
module.exports=router;