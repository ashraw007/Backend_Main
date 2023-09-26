const express = require('express')
const adminAuth = require('../middlewares/adminAuth')
const paramsToBody = require('../utils/paramsToBody/paramsToBody')
const router = express.Router()
const Logs = require('../Models/Logs')

router.get('/', adminAuth, paramsToBody(['filters']), async(req,res)=>{
    try{
        if(req.body.filters){
            req.body.filters = JSON.parse(req.body.filters)
            if(req.body.filters.byCode !== '') {req.body.filters.statusCode = req.body.filters.byCode ; delete req.body.filters.byCode } 
            if(req.body.filters.byAdmin !== '') {req.body.filters.by = req.body.filters.byAdmin ; delete req.body.filters.byAdmin}
            if(req.body.filters.byTask !== '') {req.body.filters.operationName = req.body.filters.byTask ; delete req.body.filters.byTask}
            if(req.body.filters.byAdmin === '') {delete req.body.filters.byAdmin}
            if(req.body.filters.byTask === '') {delete req.body.filters.byTask}
            if(req.body.filters.byCode === '') {delete req.body.filters.byCode } 
        }
        const statusCode = await Logs.distinct('statusCode')
        const admins = await Logs.distinct('by')
        const operationName = await Logs.distinct('operationName')
        if( !statusCode || !admins || !operationName){
            return res.status(406).send({errorMessage: 'Something went wrong'})
        }


        req.body.timestamp = {}
        req.body.timestamp.from = req.body.filters.from  || 1609462861000 
        req.body.timestamp.to = req.body.filters.to  || new Date().getTime()
        
        delete req.body.filters.from
        delete req.body.filters.to

 
        const logs = await Logs.find({...req.body.filters, createdAt:{
            $gte: req.body.timestamp.from, 
            $lt: req.body.timestamp.to
        }}).sort({created_at: -1}).skip(0).limit(500)
        res.status(200).send({statusCode, admins, operationName, logs})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: "Cant get Logs now, try again later !"})
    }
})

module.exports = router