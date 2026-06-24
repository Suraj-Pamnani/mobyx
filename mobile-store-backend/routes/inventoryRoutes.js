const express = require("express");

const router = express.Router();


const {
getLowStockProducts
}=require("../controllers/inventoryController");


const {
protect,
admin
}=require("../middleware/authMiddleware");



router.get(
"/low-stock",
protect,
admin,
getLowStockProducts
);



module.exports = router;