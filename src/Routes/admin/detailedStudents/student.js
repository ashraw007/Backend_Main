const express = require('express')
const processValue = require('../../../middlewares/processValue')
const mongoose = require('mongoose')
const router = new express.Router()
const Student = require('../../../Models/Student')
const adminAuth = require('../../../middlewares/adminAuth')
const Receipt = require('../../../Models/Payment')
const paramsToBody = require('../../../utils/paramsToBody/paramsToBody')

router.get('/branches', adminAuth, async(req,res)=>{
    try{
        let branches = await Student.find().select(['branch' ,'currentSemester' ,'timing', 'batch'])
        branches = [...new Set(branches.map(branch => branch.branch + ' | ' + branch.timing + ' | ' + branch.batch + ' | ' + branch.currentSemester))].sort()
        res.status(200).send({branches})
    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: 'Something went wrong'})
    }
})

router.get('/students',adminAuth, paramsToBody(['branch']), async(req,res)=>{
    try{
        if(!req.body.branch){
            return res.status(406).send({errorMessage: 'Invalid branch'})
        }
        const filters = req.body.branch.split(' | ')
        const studentData = await Student.find({branch: filters[0], timing: filters[1], batch: filters[2], currentSemester: filters[3] })
        if(studentData.length === 0){
            return res.status(406).send({errorMessage: 'No student found'})
        }
        const rollNumbers = studentData.map(student => student.rollNumber)
        const receiptsData = await Receipt.find({isSuccess: true, isValid: true, rollNumber: { $in: rollNumbers }}).select(['rollNumber', 'receiptID', 'notes'])
        const joinedData = [] 
        studentData.map((student,index) => {
            let data = {...student._doc}
            
            delete data._id
            delete data.password
            delete data.tokens
            delete data.__v
            delete data.createdAt
            delete data.updatedAt
            delete data.resetPasswordToken

            const receipts = receiptsData.filter(receipt => receipt.rollNumber === student.rollNumber)
            data["receipts"] = receipts
            joinedData.push(data) 
        })
        res.status(200).send({students: joinedData})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Cant get data now, please try again later !'})
    }
})



module.exports = router