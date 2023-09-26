const express = require('express')
const router = new express.Router()
const keyAuth = require('../../middlewares/keyAuth')
const processValue = require('../../middlewares/processValue')
const errorHandler = require('../../utils/errorHandler/errorHandler')
const Subject = require('../../Models/Subject')

router.get('/', 
            keyAuth,
            processValue(['semester', 'branch']),
            async(req,res)=>{
                try{
                    const subjects = await Subject.findOne({semester: req.body.semester, branch : req.body.branch })
                    if(!subjects) {
                        return res.status(406).send({errorMessage: "Subjects Not found"})
                    }
                    return res.statu(200).send(subjects)
                }catch(e){
                    console.log(e)
                    return res.status(500).send({errorMessage: "Server internal error"})
                }
            }
            
)



router.post('/', 
            keyAuth , 
            processValue(['branch', 'semester', 'subjects']) ,
            async(req,res) => {
                try{
                    const subjects = await Subject.findOne({semester: req.body.semester, branch: req.body.branch})
                    if(!subjects){
                        if(req.body.semester > 6){
                            return res.status(406).send({errorMessage: "Semester cannot be bigger than 6"})
                        }
                        const subject = await Subject.create(req.body)
                        return res.status(200).send({subject, created:true})
                    }else{
                        req.body.subjects.forEach(subject => {
                            if(typeof(subject) !== "string") return res.staus(406).send({errorMessage: "please provide a string"})})
                        const subject  = await Subject.findByIdAndUpdate({_id: subjects._id},{subjects: req.body.subjects})
                        return res.status(200).send({subject})
                    }
                }catch(e){
                    console.log(e)
                    return res.status(400).send({errorMessage: 'Something went wrong ! please try again !'})
                }
            }
)

router.delete('/', 
            keyAuth, 
            processValue(['semester', 'branch']),
            async(req,res)=>{
                try{
                    let subject = await Subject.findOneAndDelete({semester: req.body.semester, branch: req.body.branch})
                    if(!subject){
                        return res.status(406).send({errorMessage: 'Subject not found'})
                    }
                    return res.status(200).send({subject})
                }catch(e){
                    console.log(e)
                    return res.status(400).send({errorMessage: 'Something went wrong ! please try again !'})
                }
            }
)


module.exports = router