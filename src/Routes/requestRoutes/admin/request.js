const express = require('express')
const router = new express.Router()
const Request = require('../../../Models/Update')
const processValue = require('../../../middlewares/processValue')
const Receipt = require('../../../Models/Payment')
const adminAuth = require('../../../middlewares/adminAuth')
const paramsToBody = require('../../../utils/paramsToBody/paramsToBody')
const logger = require('../../../logger/logger')

router.get('/', adminAuth, paramsToBody(['filters']) , async(req,res)=>{
    try{
        if(!req.body.paged){
            req.body.paged = {}
            req.body.paged.start = 0
            req.body.paged.end = 500
        }
        if(req.body.filters){
            req.body.filters = JSON.parse(req.body.filters)
            if(req.body.filters.rollNumber === 0) delete req.body.filters.rollNumber
            if(req.body.filters.branch === '') delete req.body.filters.branch
            if(req.body.filters.semester === 0) delete req.body.filters.semester
        }
        const request = await Request.find({...req.body.filters,isValid: false} ).sort({created_at: -1}).skip(req.body.paged.start).limit(req.body.paged.end)

        res.status(200).send({request})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage:'Something went wrong'})
    }
})

router.patch('/', adminAuth, processValue(['id', 'success']), async(req,res)=>{
    try{
        let request = {} 
        if(!req.body.id || !(req.body.success === true || req.body.success === false)  ){
            logger(406, req.admin.adminID,  ' Accept request ', 3)
            return res.status(406).send({errorMessage: 'Invalid body'})
        }
        if(req.body.success === true){
            request = await Request.findByIdAndUpdate(req.body.id, {isValid: true})
                if(!request){
                    logger(406, req.admin.adminID,  ' Accept request ', 3)
                    return res.status(406).send({errorMessage: 'something went wrong updating request'})
                }
            let receipt = await Receipt.findOne({receiptID: request.receiptID})
                if(!receipt){
                    logger(406, req.admin.adminID,  ' Accept request ', 3)
                    return res.status(406).send({errorMessage: 'something went wrong'})
                } 
            receipt.notes.map((note,index) => {
                receipt.notes[index] = note.replace(request.from, request.to)})
            const updatedReceipt = await Receipt.findOneAndUpdate({receiptID: request.receiptID}, {notes: receipt.notes})
            if(!updatedReceipt){
                logger(406, req.admin.adminID,  ' Accept request ', 3)
                return res.status(406).send({errorMessage: 'something went wrong'})
            } 
            logger(200, req.admin.adminID, ' Accept request ', 1)
            return res.status(200).send({success: true})
        }else if(req.body.success === false){
            request = await Request.findByIdAndDelete(req.body.id)
            logger(200, req.admin.adminID, ' Accept request ', 1)
            return res.status(200).send(request)
        }else{
            logger(400, req.admin.adminID,  ' Accept request ', 3)
            return res.status(400).send({errorMessage: 'try again later'})
        }
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Something went wrong'})
        logger(400, req.admin.adminID,  ' Accept request ', 3)
    }
})

module.exports = router

