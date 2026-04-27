exports.applyOffers = async (
cartItems,
subtotal,
coupon,
Offer
)=>{

let discount=0;

let freeGift=null;

if(coupon){

const offer=
await Offer.findOne({
code:coupon,
active:true
});

if(offer){

if(
offer.offerType==="percent_discount"
){
discount=
(subtotal*
offer.discountValue)/100;
}

if(
offer.offerType==="flat_discount"
){
discount=
offer.discountValue;
}

if(
offer.offerType==="free_product"
&& subtotal>=offer.minOrderValue
){
freeGift=
offer.freeProduct;
}

}
}

const total=
subtotal-discount;

return{
discount,
freeGift,
total
};

};