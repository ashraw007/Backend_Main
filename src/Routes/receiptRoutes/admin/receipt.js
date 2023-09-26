const express = require('express')
const adminAuth = require('../../../middlewares/adminAuth')
const processValue = require('../../../middlewares/processValue')
const router = new express.Router()
const Receipt = require('../../../Models/Payment')
const paramsToBody = require('../../../utils/paramsToBody/paramsToBody')
const moment = require('moment')

router.get('/validate', adminAuth, paramsToBody(['semester', 'rollNumber', 'receiptNumber' ]), async(req,res)=>{
    try{
        const receipt = await Receipt.findOne({semester: req.body.semester, rollNumber: req.body.rollNumber, receiptID: req.body.receiptNumber, isSuccess: true})
        if(!receipt){
            return res.status(406).send({errorMessage: 'cant find any receipt!'})
        }
        if(receipt.isPartialSuccess===false){
            return res.status(406).send({errorMessage: 'Payment doesnt seems legit, contact admin !'})
        }
        if(receipt.isValid === true){
            return res.status(406).send({errorMessage: 'Receipt is already validated'})
        }
        res.status(200).send({amount: receipt.amount, notes: receipt.notes, orderID: receipt.orderID, razorpayPaymentID:receipt.razorpayPaymentID  })
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Something went wrong, please try again later'})
    }
})

router.post('/validate', adminAuth, processValue(['orderID', 'paymentID']), async(req,res)=>{
    try{
        const receipt = await Receipt.findOne({orderID: req.body.orderID, razorpayPaymentID: req.body.paymentID})
        if(!receipt){
            logger(406, req.admin.adminID,  ' Validate receipt ', 3)
            return res.status(406).send({errorMessage: 'cant find any receipt!'})
        }
        if(receipt.isPartialSuccess===false){
            logger(406, req.admin.adminID,  ' Validate receipt ', 3)
            return res.status(406).send({errorMessage: 'Payment doesnt seems legit, contact admin !'})
        }
        if(receipt.isValid === true){
            logger(406, req.admin.adminID,  ' Validate receipt ', 3)
            return res.status(406).send({errorMessage: 'Receipt is already validated'})
        }
        receipt.isValid = true
        await receipt.save()
        res.status(200).send({saved: true})
        logger(200, req.admin.adminID, ' Validate receipt ', 1)
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Cant updated receipt now! something went wrong'})
        logger(400, req.admin.adminID,  ' Validate receipt ', 3)
    }
})

router.get('/', adminAuth, paramsToBody(['paged', 'filters']) , async(req,res)=>{
    try{
        req.body.paged = JSON.parse(req.body.paged)
        if(!req.body.paged){
            req.body.paged = {}
            req.body.paged.start = 0
            req.body.paged.end = 100
        }
        let receipts = await Receipt.find({...req.body.filters, isPartialSuccess: true} ).skip(req.body.paged.start).limit(req.body.paged.end).select(['rollNumber','semester', 'receiptID', 'notes', 'amount'])
        receipts = receipts.map(receipt => receipt.toObject())
        res.status(200).send({receipts})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage:'Something went wrong'})
    }
})

module.exports = router