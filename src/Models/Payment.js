const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    rollNumber: {
        type: Number,
        required: [true, "Please provide a roll number"],
        maxLength: 10,
        minlength: 10,
        validate(value){
            if(value.toString().length !== 10){
                throw new Error("Roll Number length has to be 10")
            }
        }
    },
    semester: {
        type: Number,
        required: true,
        enum: [1,2,3,4,5,6,7,8,9,10],
        maxLenth:2
    },
    receiptID:{
        type: String,
        required: true,
        maxlength:255,
        trim:true
    },
    orderID:{
        type: String,
        required: true,
        maxlength:255,
        trim:true
    },
    amount: {
        type: Number,
        required: true,
        maxlength:4,
    },
    notes: [{
        type: String,
        required: true,
        maxlength: 1000,
        trim:true
    }],
    date:{
        type: Date,
        required:true,
    },
    isSuccess:{
        type: Boolean,
        required: true,
        default: false
    },
    razorpayPaymentID:{
        type: String,
        sparse: true,
        maxlength:500,
        trim:true
    },
    isPartialSuccess:{
        type: Boolean,
        required: true,
        default: false
    },
    paymentErrors: [
        {
            errorCode: {
                type:String,
                sparse:true,
                maxlength:255
            },
            errorDescription: {
                type:String,
                sparse:true,
                maxlength: 255,
                trim:true
            },
            errorSource:{
                type: String,
                sparse:true,
                maxlength: 255,
                trim:true
            },
            errorReason:{
                type:String,
                sparse:true,
                maxlength:255,
                trim:true
            },
            paymentId: {
                type:String,
                sparse: true,
                maxlength: 255,
                trim : true
            }
        }
    ],
    isValid: {
        type: Boolean,
        required: true,
        default: false
    },
    currency: {
        type: String,
        required: true,
        default: "INR"
    },
    method: {
        type: String,
        sparse: true,
        maxlength: 255,
        trim:true
    }
    
}, {timestamps: true})

paymentSchema.methods.toJSON = function(){
    const receipt = this
    const receiptObj = receipt.toObject()

    delete receiptObj._id
    delete receiptObj.rollNumber
    delete receiptObj.isSuccess
    delete receiptObj.isSigned
    delete receiptObj.razorpayPaymentID
    delete receiptObj.currency
    delete receiptObj.paymentErrors
    delete receiptObj.createdAt
    delete receiptObj.updatedAt
    delete receiptObj.__v

    return receiptObj
}

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment