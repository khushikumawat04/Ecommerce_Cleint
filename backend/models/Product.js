// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   // Basic Info
//   name: { type: String, required: true },

//   // Pricing
//   price: { type: Number, required: true },          // selling price
//   originalPrice: { type: Number },                  // MRP
//   discountPercent: { type: Number },                // optional

//   // Description
//   description: String,

//   // Multiple Images (IMPORTANT)
//   images: [
//     {
//       url: String
//     }
//   ],

//   // Category
//   category: String,

//   // Stock
//   stock: { type: Number, default: 0 },
//   inStock: { type: Boolean, default: true },

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model("Product", productSchema);



const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  // BASIC INFO
  name: { type: String, required: true },
  tagline: String,
  shortDescription: String,
  fullDescription: String,

  // PRICING
  price: { type: Number, required: true },
  originalPrice: Number,
  discountPercent: Number,

  // ARRAYS (VERY IMPORTANT)
  highlights: [String],
  benefits: [String],

  // USAGE (FLEXIBLE FOR ALL PRODUCTS)
  usage: {
    howToUse: String,
    faceApplication: String,
    hairApplication: String,
    skinUse: String,
    other: String
  },

  // PRODUCT DETAILS (GENERIC OBJECT)
  details: {
    brand: String,
    productType: String,
    form: String,
    quantity: String,
    ingredient: String,
    material: String,
    shelfLife: String,
    use: String
  },

  // IMAGES
  images: [
    {
      url: String
    }
  ],

  // SEO (VERY IMPORTANT FOR REAL PROJECTS)
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },

  // CATEGORY
  category: String,

  // STOCK
  stock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Product", productSchema);