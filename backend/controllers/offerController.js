const Offer = require("../models/Offer");


/* =========================
CREATE OFFER
========================= */

exports.createOffer = async (req,res)=>{
try{

// normalize coupon code
if(req.body.code){
req.body.code =
req.body.code.toUpperCase().trim();
}

const offer = await Offer.create(req.body);

res.status(201).json({
success:true,
message:"Offer created successfully",
offer
});

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}
};



/* =========================
GET ALL ACTIVE OFFERS
========================= */

exports.getOffers = async(req,res)=>{
try{

const offers =
await Offer.find({
active:true
}).populate(
"productId",
"name price images"
);

res.status(200).json({
success:true,
count:offers.length,
offers
});

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}
};



/* =========================
APPLY COUPON
========================= */

exports.applyCoupon = async(req,res)=>{
try{

const { code, cartTotal } = req.body;

if(!code){
return res.status(400).json({
success:false,
message:"Coupon code required"
});
}


const offer =
await Offer.findOne({
code:code.toUpperCase().trim(),
type:"coupon",
active:true
});


if(!offer){
return res.json({
success:false,
message:"Invalid Coupon"
});
}


/* optional min order validation */
if(
offer.minOrderValue &&
cartTotal < offer.minOrderValue
){
return res.json({
success:false,
message:`Minimum order ₹${offer.minOrderValue} required`
});
}


/* FIXED: discountPercent not discountValue */
const discount =
(cartTotal * offer.discountPercent)/100;

const finalTotal =
cartTotal-discount;


res.json({
success:true,
discount,
finalTotal,
offer
});

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}
};