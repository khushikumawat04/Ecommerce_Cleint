const Offer = require("../models/Offer");



/* =========================
CREATE OFFER
========================= */

exports.createOffer = async (req,res)=>{
try{

let {
  title,
type,
code,
discountPercent,
minOrderValue,
buyQty,
freeQty,
productId,
applyTo,
applicableProducts,
applicableCategory,
startDate,
endDate
} = req.body;


/* ---------------- NORMALIZE ---------------- */
if(code){
code = code.toUpperCase().trim();
}


/* ---------------- FORCE RULES ---------------- */

// 🔥 BOGO must always be product based
if(type === "bogo"){
applyTo = "products";
}

// remove empty productId
if(!productId){
productId = undefined;
}


/* ---------------- VALIDATIONS ---------------- */

// coupon
if(type === "coupon"){
if(!code){
return res.status(400).json({ message:"Coupon code required" });
}
}

// auto discount
if(type === "auto_discount"){
if(!discountPercent){
return res.status(400).json({ message:"Discount percent required" });
}
}

// BOGO
if(type === "bogo"){
if(!productId || !buyQty || !freeQty){
return res.status(400).json({
message:"BOGO requires product + buyQty + freeQty"
});
}
}

// applyTo logic
if(applyTo === "products" && type !== "bogo"){
if(!applicableProducts || applicableProducts.length === 0){
return res.status(400).json({
message:"Select at least one product"
});
}
}

if(applyTo === "category"){
if(!applicableCategory){
return res.status(400).json({
message:"Category required"
});
}
}


// date validation
if(startDate && endDate){
if(new Date(startDate) > new Date(endDate)){
return res.status(400).json({
message:"Start date cannot be after end date"
});
}
}


/* ---------------- CREATE ---------------- */

const offer = await Offer.create({
  title,
type,
code,
discountPercent,
minOrderValue,
buyQty,
freeQty,
productId,
applyTo,
applicableProducts,
applicableCategory,
startDate,
endDate
});

res.status(201).json({
success:true,
message:"Offer created successfully",
offer
});

}catch(error){
res.status(500).json({
success:false,
message:error.message
});
}
};

/* =========================
 Update OFFERS
========================= */
exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      title,
      type,
      code,
      discountPercent,
      minOrderValue,
      buyQty,
      freeQty,
      productId,
      applyTo,
      applicableProducts,
      applicableCategory,
      startDate,
      endDate
    } = req.body;

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    /* -------- NORMALIZE -------- */
    if (code) {
      code = code.toUpperCase().trim();
    }

    /* -------- FORCE RULES -------- */
    if (type === "bogo") {
      applyTo = "products";
    }

    if (!productId) {
      productId = undefined;
    }

    /* -------- VALIDATIONS -------- */

    if (type === "coupon" && !code) {
      return res.status(400).json({ message: "Coupon code required" });
    }

    if (type === "auto_discount" && !discountPercent) {
      return res.status(400).json({ message: "Discount percent required" });
    }

    if (type === "bogo") {
      if (!productId || !buyQty || !freeQty) {
        return res.status(400).json({
          message: "BOGO requires product + buyQty + freeQty"
        });
      }
    }

    if (applyTo === "products" && type !== "bogo") {
      if (!applicableProducts || applicableProducts.length === 0) {
        return res.status(400).json({
          message: "Select at least one product"
        });
      }
    }

    if (applyTo === "category") {
      if (!applicableCategory) {
        return res.status(400).json({
          message: "Category required"
        });
      }
    }

    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
          message: "Start date cannot be after end date"
        });
      }
    }

    /* -------- UPDATE -------- */

    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      {
        title,
        type,
        code,
        discountPercent,
        minOrderValue,
        buyQty,
        freeQty,
        productId,
        applyTo,
        applicableProducts,
        applicableCategory,
        startDate,
        endDate
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      offer: updatedOffer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* =========================
Delete ACTIVE OFFERS
========================= */
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        message: "Offer not found"
      });
    }

    await Offer.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Offer deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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
).populate("applicableProducts", "name");

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



exports.applyBestOffer = async (req, res) => {
try {

const { cartItems, cartTotal, couponCode } = req.body;

const offers = await Offer.find({ active: true });

let bestOffer = null;
let maxDiscount = 0;
let appliedType = null;

/* ---------------- COUPON ---------------- */
if(couponCode){

const coupon = offers.find(o =>
o.type === "coupon" &&
o.code === couponCode.toUpperCase().trim()
);

if(coupon){

if(
coupon.minOrderValue &&
cartTotal < coupon.minOrderValue
){
return res.json({
success:false,
message:`Minimum order ₹${coupon.minOrderValue} required`
});
}

const discount =
(cartTotal * coupon.discountPercent) / 100;

if(discount > maxDiscount){
maxDiscount = discount;
bestOffer = coupon;
appliedType = "coupon";
}
}
}

/* ---------------- AUTO ---------------- */
offers.forEach(offer => {

if(
offer.type === "auto_discount" &&
cartTotal >= offer.minOrderValue
){

const discount =
(cartTotal * offer.discountPercent) / 100;

if(discount > maxDiscount){
maxDiscount = discount;
bestOffer = offer;
appliedType = "auto_discount";
}
}

});

let bogoDetails = []; // keep this above

/* ---------------- BOGO ---------------- */
offers.forEach(offer => {

  if (offer.type === "bogo") {

    const product = cartItems.find(
      item => item._id === offer.productId?.toString()
    );

    if (product && product.quantity >= offer.buyQty) {

      const freeItems =
        Math.floor(product.quantity / offer.buyQty) * offer.freeQty;

      // ✅ IMPORTANT: ONLY APPLY IF FREE ITEMS EXIST
      if (freeItems > 0) {

        const discount = freeItems * product.price;

        // ✅ STORE DETAILS
        bogoDetails.push({
          productId: product._id,
          productName: product.name,
          buyQty: offer.buyQty,
          freeQty: offer.freeQty,
          freeItems,
          discount
        });

        // ✅ BEST OFFER CHECK
        if (discount > maxDiscount) {
          maxDiscount = discount;
          bestOffer = offer;
          appliedType = "bogo";
        }
      }
    }
  }

});


/* ---------------- FINAL ---------------- */

if(!bestOffer){
return res.json({
success:false,
message:"No offer applicable"
});
}

const finalTotal = cartTotal - maxDiscount;

return res.json({
success:true,
type: appliedType,
discount: maxDiscount,
finalTotal,
bogoDetails: appliedType === "bogo" ? bogoDetails : []
});

}catch(error){
res.status(500).json({
success:false,
message:error.message
});
}
};
// exports.applyCoupon = async(req,res)=>{
// try{

// const { code, cartTotal, appliedOfferType } = req.body;

// /* 🔥 BLOCK IF OTHER OFFER APPLIED */
// if(appliedOfferType){
// return res.json({
// success:false,
// message:"Another offer already applied"
// });
// }

// if(!code){
// return res.status(400).json({
// success:false,
// message:"Coupon code required"
// });
// }

// const offer = await Offer.findOne({
// code:code.toUpperCase().trim(),
// type:"coupon",
// active:true
// });

// if(!offer){
// return res.json({
// success:false,
// message:"Invalid Coupon"
// });
// }

// /* 🔥 DATE VALIDATION */
// const now = new Date();

// if(offer.startDate && now < offer.startDate){
// return res.json({
// success:false,
// message:"Coupon not started yet"
// });
// }

// if(offer.endDate && now > offer.endDate){
// return res.json({
// success:false,
// message:"Coupon expired"
// });
// }

// /* MIN ORDER */
// if(
// offer.minOrderValue &&
// cartTotal < offer.minOrderValue
// ){
// return res.json({
// success:false,
// message:`Minimum order ₹${offer.minOrderValue} required`
// });
// }

// /* DISCOUNT */
// const discount =
// (cartTotal * offer.discountPercent)/100;

// const finalTotal =
// cartTotal-discount;

// res.json({
// success:true,
// type:"coupon",
// discount,
// finalTotal,
// offer
// });

// }catch(error){

// res.status(500).json({
// success:false,
// message:error.message
// });

// }
// };