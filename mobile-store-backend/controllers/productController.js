const Product = require("../models/Product");
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Get all products

exports.getProducts = async (req, res) => {

    try {

        const {
            keyword,
            brand,
            minPrice,
            maxPrice,
            page = 1,
            limit = 5
        } = req.query;


        let query = {};


        // Search by name/model

        if(keyword){

            query.modelName = {
                $regex: keyword,
                $options: "i"
            };

        }


        // Filter brand

        if(brand){

            query.brand = brand;

        }


        // Filter price

        if(minPrice || maxPrice){

            query.price = {};

            if(minPrice){
                query.price.$gte = Number(minPrice);
            }

            if(maxPrice){
                query.price.$lte = Number(maxPrice);
            }

        }


        const products = await Product.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit));


        const totalProducts = await Product.countDocuments(query);


        res.status(200).json({

            success:true,

            totalProducts,

            currentPage:Number(page),

            products

        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};
exports.getSingleProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);


        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }


        res.status(200).json({
            success:true,
            product
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};
exports.createReview = async (req, res) => {

  try {

    const {
      rating,
      comment
    } = req.body;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const review = {

      user: req.user.id,

      name: req.user.name,

      rating: Number(rating),

      comment

    };

    const alreadyReviewed =
      product.reviews.find(
        r => r.user.toString() === req.user.id
      );

    if (alreadyReviewed) {

      return res.status(400).json({
        success: false,
        message: "Already reviewed"
      });

    }

    product.reviews.push(review);

    product.numReviews =
      product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (acc, item) => acc + item.rating,
        0
      ) / product.reviews.length;

    await product.save();

    res.status(201).json({

      success: true,

      message: "Review Added"

    });

  }
  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};