const router=
require("express").Router();

const {
createOffer,
getOffers,
applyCoupon,
applyBestOffer,
updateOffer,
deleteOffer
}=require("../controllers/offerController");

router.post("/",createOffer);

router.get("/",getOffers);

router.put("/offer/:id", updateOffer);

router.delete("/offer/:id", deleteOffer);

router.post(
"/apply-best-offer",
applyBestOffer
);

module.exports=router;