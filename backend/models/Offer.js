const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({

title:String,

type:{
type:String,
enum:[
"coupon",
"auto_discount",
"bogo"
]
},

code:String, // for coupon

discountPercent:Number,

minOrderValue:Number,

buyQty:Number,
freeQty:Number,

productId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Product"
},

active:{
type:Boolean,
default:true
}

},{timestamps:true});

module.exports=
mongoose.model("Offer",offerSchema);