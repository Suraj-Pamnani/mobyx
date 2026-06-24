const Product = require("../models/Product");


exports.getLowStockProducts = async(req,res)=>{

try{


const products =
await Product.find({
    stock:{
        $lte:5
    }
});


res.status(200).json({

    success:true,

    count:products.length,

    products

});


}
catch(error){

res.status(500).json({

    success:false,

    message:error.message

});

}


};