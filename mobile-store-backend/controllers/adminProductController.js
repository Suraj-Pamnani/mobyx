const Product = require("../models/Product");


// Add Product

exports.createProduct = async(req,res)=>{

try{

const product = await Product.create(req.body);


res.status(201).json({

    success:true,

    message:"Product Created",

    product

});


}
catch(error){

res.status(500).json({

    success:false,

    message:error.message

});

}

};



// Update Product

exports.updateProduct = async(req,res)=>{


try{


const product =
await Product.findByIdAndUpdate(

req.params.id,

req.body,

{
returnDocument:"after"
}

);



if(!product){

return res.status(404).json({

success:false,

message:"Product not found"

});

}


res.json({

success:true,

product

});


}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};




// Delete Product

exports.deleteProduct = async(req,res)=>{


try{


const product =
await Product.findById(req.params.id);



if(!product){

return res.status(404).json({

success:false,

message:"Product not found"

});

}



await product.deleteOne();



res.json({

success:true,

message:"Product deleted"

});


}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};