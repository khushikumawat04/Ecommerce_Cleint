const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({

title: String,

type:{
type:String,
enum:["coupon","auto_discount","bogo"]
},

code:String,

discountPercent:Number,
minOrderValue:Number,

buyQty:Number,
freeQty:Number,

/* ✅ SINGLE SOURCE OF TRUTH */
applyTo:{
type:String,
enum:["all","products","category"],
default:"all"
},

/* for selected products */
applicableProducts:[{
type:mongoose.Schema.Types.ObjectId,
ref:"Product"
}],

/* for category */
applicableCategory:String,

/* for BOGO only */
productId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Product"
},

startDate: Date,
endDate: Date,

active:{
type:Boolean,
default:true
}

},{timestamps:true});

module.exports = mongoose.model("Offer",offerSchema);