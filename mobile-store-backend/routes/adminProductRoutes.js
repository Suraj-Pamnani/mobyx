const express = require("express");

const router = express.Router();


const {

createProduct,

updateProduct,

deleteProduct


}=require("../controllers/adminProductController");


const {

protect,

admin

}=require("../middleware/authMiddleware");



router.post(
"/",
protect,
admin,
createProduct
);



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