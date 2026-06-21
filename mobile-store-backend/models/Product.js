const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true
    },

    modelName: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    stock: {
      type: Number,
      required: true,
      default: 0
    },

    description: {
      type: String,
      required: true
    },

    images: [
      {
        type: String
      }
    ],

    specifications: {
      ram: String,
      storage: String,
      processor: String,
      display: String,
      battery: String,
      camera: String
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },

        name: String,

        rating: Number,

        comment: String,

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    numReviews: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);