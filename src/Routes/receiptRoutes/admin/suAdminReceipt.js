const express = require('express')
const router = new express.Router()
const keyAuth = require('../../../middlewares/keyAuth')
const processValue = require('../../../middlewares/processValue')
const Receipt = require('../../../Models/Payment')
const Razorpay = require('razorpay')
const {nanoid} = require('nanoid')

router.get('/getOrder', keyAuth, processValue(['id']), async (req, res)=>{
    
    if(!req.body.id){
        return res.status(406).send({errorMessage:"Please provide an ID"})
    }
    try{
        var instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
          })
        const order_id = req.body.id
        const order = instance.orders.fetch(order_id)
        if(!order){
            return res.status(400).send({errorMessage: 'Cant find order matching the order id'})
        }
        return res.status(200).send({order})
    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: 'Something went Wrong'})
    } 
})

router.get('/getPayments', keyAuth, processValue(['id']), async (req, res)=>{
    if(!req.body.id){
        return res.status(406).send({errorMessage:"Please provide an ID"})
    }
    try{
        var instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
          })
        const order_id = req.body.id
        const order = instance.orders.fetchPayments(order_id)
        if(!order){
            return res.status(400).send({errorMessage: 'Cant find order matching the order id'})
        }
        return res.status(200).send({order})
    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: 'Something went Wrong'})
    }

})

router.get('/getPaymentsDetails', keyAuth, processValue(['id']), async (req, res)=>{
    if(!req.body.id){
        return res.status(406).send({errorMessage:"Please provide an ID"})
    }
    try{
        var instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
          })
        const payment_id = req.body.id
        const payment = instance.payments.fetch(payment_id)
        if(!payment){
            return res.status(406).send({errorMessage: 'Cant find order matching the order id'})
        }
        return res.status(200).send({payment})
    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: 'Something went Wrong'})
    }

})

router.get('/orderDetails', keyAuth, processValue(['receiptID']), async(req,res)=>{
    try{
        const receipt = await Receipt.findOne({receiptID: req.body.receiptID})
        if(!receipt){
            return res.status(406).send({errorMessage: 'No receipt Found'})
        }
        return res.status(200).send({receipt})
    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: "Some error occurred"})
    }
})

router.post('/fixSignature', keyAuth, processValue(['orderID']), async(req,res)=>{
    try{
        let receipt = await Receipt.findOne({orderID: req.body.orderID})
        if(!receipt){
            return res.status(406).send({errorMessage: 'No receipt Found'})
        }
        if(receipt.isPartialSuccess === true){
            return res.status(406).send({errorMessage: 'Receipt already signed'})
        }
        receipt.isPartialSuccess = true
        receipt.isSuccess = true
        receipt.razorpayPaymentID = `Admin_${nanoid()}`
        receipt = await receipt.save()
        return res.status(200).send({receipt})
    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: 'Some error occurred'})
    }
})


module.exports = router