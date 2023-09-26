const Razorpay = require('razorpay')
var crypto = require('crypto');

const hooksValidation = async (req,res,next) => {
    const signature = req.header('X-Razorpay-Signature')
    if(Razorpay.validateWebhookSignature(Buffer.from(JSON.stringify(req.body)), signature, process.env.HOOKSIGNATURE)){
        next()
    }
}



module.exports = hooksValidation