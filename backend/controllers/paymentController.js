const razorpay = require("../config/razorpay");
const Order = require("../models/Orders");
const crypto = require("crypto");


// CREATE RAZORPAY ORDER
exports.createOrder = async(req,res)=>{
try{

let { amount } = req.body;

amount=Number(amount);

if(!amount || amount<=0){
return res.status(400).json({
success:false,
message:"Invalid amount"
});
}

const options={
amount:Math.round(amount*100),
currency:"INR",
receipt:"receipt_"+Date.now()
};

const razorOrder=
await razorpay.orders.create(options);

res.json(razorOrder);

}catch(err){
res.status(500).json({
success:false,
message:err.message
})
}
}

exports.verifyPayment=async(req,res)=>{
try{

const {
razorpay_order_id,
razorpay_payment_id,
razorpay_signature
}=req.body;

const body=
razorpay_order_id+"|"+razorpay_payment_id;

const expectedSignature=
crypto
.createHmac(
"sha256",
process.env.RAZORPAY_KEYSECRET
)
.update(body)
.digest("hex");

if(expectedSignature===razorpay_signature){

return res.json({
success:true,
paymentId:razorpay_payment_id
});

}

return res.status(400).json({
success:false,
message:"Signature mismatch"
});

}catch(err){
res.status(500).json({
error:err.message
});
}
};