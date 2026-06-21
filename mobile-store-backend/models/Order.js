const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(
{

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },

            quantity:Number,

            price:Number
        }
    ],


    totalAmount:{
        type:Number,
        required:true
    },


    shippingAddress:{
        address:String,
        city:String,
        state:String,
        pincode:String
    },


    paymentStatus:{
        type:String,
        default:"Pending"
    },


    razorpayPaymentId:String,


    orderStatus:{
        type:String,
        default:"Processing"
    }


},
{
    timestamps:true
});


module.exports = mongoose.model(
    "Order",
    orderSchema
);