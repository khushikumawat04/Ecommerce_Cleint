const router=
require("express").Router();

const {
createOffer,
getOffers,
applyCoupon
}=require("../controllers/offerController");

router.post("/",createOffer);

router.get("/",getOffers);

router.post(
"/apply-coupon",
applyCoupon
);

module.exports=router;