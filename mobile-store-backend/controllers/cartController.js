const Cart = require("../models/Cart");


// Add product to cart

exports.addToCart = async(req,res)=>{

    try{

        const {productId} = req.body;


        let cart = await Cart.findOne({
            user:req.user.id
        });


        if(!cart){

            cart = await Cart.create({
                user:req.user.id,
                items:[
                    {
                        product:productId,
                        quantity:1
                    }
                ]
            });

        }
        else{


            const itemIndex = cart.items.findIndex(
                item =>
                item.product.toString() === productId
            );


            if(itemIndex > -1){

                cart.items[itemIndex].quantity += 1;

            }
            else{

                cart.items.push({
                    product:productId,
                    quantity:1
                });

            }


            await cart.save();

        }



        res.status(200).json({
            success:true,
            cart
        });


    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};
// Get Cart

exports.getCart = async(req,res)=>{

    try{

        const cart = await Cart.findOne({
            user:req.user.id
        }).populate("items.product");


        if(!cart){

            return res.status(200).json({
                success:true,
                items:[]
            });

        }


        res.status(200).json({
            success:true,
            cart
        });


    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};
// Update Cart Quantity

exports.updateCart = async(req,res)=>{

    try{

        const {productId, quantity} = req.body;


        const cart = await Cart.findOne({
            user:req.user.id
        });


        if(!cart){

            return res.status(404).json({
                success:false,
                message:"Cart not found"
            });

        }


        const item = cart.items.find(
            item =>
            item.product.toString() === productId
        );


        if(!item){

            return res.status(404).json({
                success:false,
                message:"Product not in cart"
            });

        }


        item.quantity = quantity;


        await cart.save();



        res.status(200).json({

            success:true,
            cart

        });


    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};
// Remove item from cart

exports.removeFromCart = async(req,res)=>{

    try{

        const {productId} = req.body;


        const cart = await Cart.findOne({
            user:req.user.id
        });


        if(!cart){

            return res.status(404).json({
                success:false,
                message:"Cart not found"
            });

        }


        cart.items = cart.items.filter(
            item =>
            item.product.toString() !== productId
        );


        await cart.save();



        res.status(200).json({

            success:true,
            message:"Product removed from cart",
            cart

        });


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};
// Calculate Cart Total

exports.getCartTotal = async(req,res)=>{

    try{

        const cart = await Cart.findOne({
            user:req.user.id
        })
        .populate("items.product");


        if(!cart){

            return res.status(404).json({
                success:false,
                message:"Cart not found"
            });

        }


        let total = 0;


        cart.items.forEach(item=>{

            total += item.product.price * item.quantity;

        });



        res.status(200).json({

            success:true,

            totalAmount: total,

            cart

        });


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};