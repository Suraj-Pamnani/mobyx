const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");


let razorpay = null;

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (razorpayKeyId && razorpayKeySecret) {
  razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
}






exports.createOrder = async (req, res) => {


    try {
        if (!req.body.address) {

            return res.status(400).json({
                success: false,
                message: "Shipping address required"
            });

        }

        const cart = await Cart.findOne({
            user: req.user.id
        })
            .populate("items.product");



        if (!cart || cart.items.length === 0) {

            return res.status(400).json({

                message: "Cart is empty"

            });

        }



        let total = 0;


        const products = cart.items.map(item => {


            total += item.product.price * item.quantity;


            return {

                product: item.product._id,

                quantity: item.quantity,

                price: item.product.price

            };


        });





        const order = await Order.create({

            user: req.user.id,

            products,

            totalAmount: total,

            shippingAddress: req.body.address || {}



        });





        if (!razorpay) {
            return res.status(500).json({
                success: false,
                message: "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env.",
            });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: total * 100,
            currency: "INR",
            receipt: order._id.toString(),
        });






        res.json({

            success: true,

            orderId: order._id,

            razorpayOrder

        });



    }
    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }


};
exports.verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;


        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");


        if (
            generatedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({
                success: false,
                message: "Payment Verification Failed"
            });

        }


        const order = await Order.findOne({
            _id: req.body.orderId
        });


        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });

        }


        order.paymentStatus = "Paid";

        order.razorpayPaymentId =
            razorpay_payment_id;


        /*
        Reduce Product Stock
        */

        for (const item of order.products) {

            const product =
                await Product.findById(
                    item.product
                );

            if (product) {

                product.stock -= item.quantity;

                await product.save();
            }

        }


        await order.save();

        await sendEmail({

            email: req.user.email,

            subject: "Payment Successful - Mobile Store",

            message: `

           <h2>Payment Successful 🎉</h2>

          <p>Your payment has been received.</p>

          <p>
          Order ID:
          <b>${order._id}</b>
         </p>

         <p>
         Amount Paid:
         <b>₹${order.totalAmount}</b>
         </p>

         <p>
         Thank you for shopping with us.
         </p>

`

        });

        await sendEmail({

            email: req.user.email,

            subject: "Order Placed Successfully",

            message: `  

         <h2>Thank you for your order</h2>

         <p>Your order ID is ${order._id}</p>

         <p>Total Amount: ₹${total}</p>

`

        });

        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { items: [] }
        );

        res.status(200).json({

            success: true,

            message: "Payment Verified Successfully"

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
exports.getMyOrders = async (req, res) => {

    try {

        const orders =
            await Order.find({
                user: req.user.id
            })
                .populate("products.product");


        res.status(200).json({

            success: true,

            count: orders.length,

            orders

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products.product");

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.orderStatus = req.body.status;

        await order.save();

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};