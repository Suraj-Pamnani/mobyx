const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");



exports.getDashboardStats = async(req,res)=>{


try{


const totalUsers =
await User.countDocuments();



const totalProducts =
await Product.countDocuments();



const totalOrders =
await Order.countDocuments();



const paidOrders =
await Order.countDocuments({
    paymentStatus:"Paid"
});



const pendingOrders =
await Order.countDocuments({
    paymentStatus:"Pending"
});



const revenueData =
await Order.aggregate([

    {
        $match:{
            paymentStatus:"Paid"
        }
    },


    {
        $group:{
            _id:null,
            total:{
                $sum:"$totalAmount"
            }
        }
    }

]);



const totalRevenue =
revenueData.length > 0
?
revenueData[0].total
:
0;



res.status(200).json({

    success:true,

    dashboard:{

        totalUsers,

        totalProducts,

        totalOrders,

        paidOrders,

        pendingOrders,

        totalRevenue

    }

});


}
catch(error){


res.status(500).json({

    success:false,

    message:error.message

});


}


};