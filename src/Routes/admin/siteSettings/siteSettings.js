const express = require('express')
const router = new express.Router()
const SiteSettings = require('../../../Models/Settings')
const processValue = require('../../../middlewares/processValue')
const adminAuth = require('../../../middlewares/adminAuth')
const moment = require('moment')
const logger = require('../../../logger/logger')

router.get('/',adminAuth, async(req,res)=>{
    try{
        const data = await SiteSettings.findOne()
        if(!data){throw new Error()}
        res.status(200).send(data)
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'cant fetch data, try again !'})
    }
})

router.patch('/notices',adminAuth, processValue(['notices']), async (req,res)=>{
    try{
        if(!req.body.notices){
            logger(406, req.admin.adminID,  ' Update notices ', 3)
            return res.status(406).send({errorMessage: "notices should be an array"})
        }
        const settings = await SiteSettings.findOne()
        if(!settings){
            logger(406, req.admin.adminID,  ' Update notices ', 3)
            return res.status(406).send({errorMessage: 'Please contact admin'})
        }    
        const err_notices = []
        const notices = []
        req.body.notices.slice(0, 5).forEach((notice,index)=> {
            if(notice.title && (notice.title.length > 1 && notice.title.length < 1000) && notice.desc && (notice.desc.length > 1 && notice.desc.length < 2000) ){
                notices.push(notice)
            }else{
                notices.push({title: '', desc: ''})
                err_notices.push(notice)
            }
        })   
        settings.notices = notices
        const savedNotices = await SiteSettings.findOneAndUpdate({notices: notices})
        res.status(200).send({success: true})
        logger(200, req.admin.adminID, ' Update notices ', 1)
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'something went wrong ! try again !'})
        logger(400, req.admin.adminID,  ' Update notices ', 3)
    }
})

router.patch('/fee', 
            adminAuth,
            processValue(['normalFee', 'backExamFee','maxPerSemesterFee','minLateFeeDate','maxLateFeeDate','minLateFee', 'maxLateFee' ]), 
            async(req,res)=>{
                try{
                    req.body.maxLateFeeDate = moment(req.body.maxLateFeeDate)
                    req.body.minLateFeeDate = moment(req.body.minLateFeeDate)
                    const settings = await SiteSettings.findOne()
                    if(!settings){
                        logger(406, req.admin.adminID,  ' Update fee ', 3)
                        return res.status(406).send({errorMessage: 'Please contact admin'})
                    }    
                    values = Object.keys(req.body)
                    values.forEach(value => {
                        settings[value] = Number(req.body[value]) 
                    });
                    const savedSetting = await settings.save()
                    res.status(200).send({success: true})
                    logger(200, req.admin.adminID, ' Update fee ', 1)
                }catch(e){
                    console.log(e)
                    res.status(400).send({errorMessage: 'cant update settings now'})
                    logger(400, req.admin.adminID,  ' Update fee ', 3)
                }
})

module.exports = router