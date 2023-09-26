const express = require('express')
const router = new express.Router() 
const errorHandler = require('../../utils/errorHandler/errorHandler')
const studentAuth = require('../../middlewares/studentAuth')
const Subject = require('../../Models/Subject')
const Settings = require('../../Models/Settings')

router.get('/', studentAuth ,async(req,res)=>{
    const odd = [1,3,5]
    const even = [2,4,6]
    try{
        const evenOdd = (req.student.currentSemester)%2 
        let validSems = evenOdd === 1 ? odd : even
        validSems=validSems.filter(sem=> sem < req.student.currentSemester)
        const subjects = await Subject.find({branch: req.student.branch, semester:{$in: validSems}})
        let settings = await Settings.findOne()
        settings = settings.toObject()
        delete settings._id
        delete settings.notices
        delete settings.createdAt
        delete settings.updatedAt
        delete settings.notices
        delete settings.__v
        return res.status(200).send({student: req.student, subjects: subjects, fees:settings})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Cant fetch data, Please re-try !' })
    }
})

router.get('/notices', studentAuth ,async(req,res)=>{
    try{
        let settings = await Settings.findOne({})
        if(!settings){
            return res.status(406).send()
        }
        settings = settings.toObject()
        settings.notices.forEach(notice => delete notice._id)
        return res.status(200).send({notices: settings.notices})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Cant fetch notices now !'})
    }
})

module.exports = router