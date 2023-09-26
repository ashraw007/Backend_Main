const express = require('express')
const router = new express.Router()
const hooksValidation = require('../../../middlewares/HooksValidation')
const Receipt = require('../../../Models/Payment')
const Student = require('../../../Models/Student')

router.post('/authorized', hooksValidation , async(req,res)=>{
    if(req.body.event !== "payment.authorized"){
        return 0
    }
    let rollNumber  = (req.body.payload.payment.entity.description.split("For"))[0]
    const regex = /,/g;
    rollNumber = parseInt(rollNumber.match(/\d/g).join().replace(regex, ''))
    try{
        let receipt = {}
        if(req.body.payload.payment.entity.order_id){
            receipt = await Receipt.findOne({orderID: req.body.payload.payment.entity.order_id})
        }else{
            receipt = await Receipt.findOne({rollNumber: rollNumber, notes:req.body.payload.payment.entity.notes })
            receipt.isSuccess = true
        }
        if(req.body.payload.payment.entity.amount !==  receipt.amount){
            console.log("Amount MisMatch : ", req.body.payload)
            console.log("receipt", receipt)
            return 0
        }
        res.send()
        receipt.isPartialSuccess = true
        receipt.razorpayPaymentID = req.body.payload.payment.entity.id
        await receipt.save()
        await Student.findOneAndUpdate({rollNumber: rollNumber},{hasPaid: true})
    }catch(e){
        console.log("Failed Body Auth : ", req.body)
        console.log("header : ", req.header('X-Razorpay-Signature'))
    }
})


router.post('/capture', hooksValidation , async(req,res)=>{
    if(req.body.event !== "payment.captured"){
        return 0
    }
    res.send()
    setTimeout(
        async function() {
            try{
                let receipt = await Receipt.findOneAndUpdate({razorpayPaymentID:req.body.payload.payment.entity.id},
                    {method: req.body.payload.payment.entity.method})
                    if(!receipt) throw new Error
                }catch(e){
                    console.log("Failed Body Cap : ", req.body)
                    console.log("header : ", req.header('X-Razorpay-Signature'))
                }
        }, 5000);
})


router.post('/paid', hooksValidation, async(req,res)=>{
    if(req.body.event !== "order.paid"){
        return 0
    }
    res.send()
    setTimeout(
        async function() {
            try{
                let receipt = await Receipt.findOneAndUpdate({razorpayPaymentID:req.body.payload.payment.entity.id,
                    orderID: req.body.payload.order.entity.id,
                    receiptID: req.body.payload.order.entity.receipt
                },
                    {isSuccess: true})
                    if(!receipt) throw new Error
                }catch(e){
                    console.log("Failed Body Paid : ", req.body)
                    console.log("header : ", req.header('X-Razorpay-Signature'))
                }
        }, 10000);
    
})


router.post('/failed', hooksValidation ,async(req,res)=>{
    if(req.body.event !== "payment.failed"){
        return 0
    }
    const rollNumber  = (req.body.payload.payment.entity.description.split("For"))[0].parseInt(match(/\d/g).join().replaceAll(",",""))
    try{
        let receipt = {}
        if(req.body.payload.payment.entity.order_id){
            receipt = await Receipt.findOne({orderID: req.body.payload.payment.entity.order_id})
        }else{
            receipt = await Receipt.findOne({rollNumber: rollNumber, notes:req.body.payload.payment.entity.notes })
        }
        receipt.isPartialSuccess = false
        receipt.isSuccess = false
        receipt.razorpayPaymentID = null
        receipt.method = null
        receipt.paymentErrors = receipt.paymentErrors.concat({
            errorCode: req.body.payload.payment.entity.error_code,
            errorDescription: req.body.payload.payment.entity.error_description,
            errorSource: req.body.payload.payment.entity.error_source,
            errorReason: req.body.payload.payment.entity.error_reason,
            paymentId: req.body.payload.payment.entity.id
        })
        await receipt.save()
        await Student.findOneAndUpdate({rollNumber: rollNumber},{hasPaid: false})
        res.send()
    }catch(e){
        console.log("Failed Body Failed : ", req.body)
        console.log("header : ", req.header('X-Razorpay-Signature'))
    }
})

module.exports = router