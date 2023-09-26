const express = require('express')
const router = new express.Router()
const studentAuth = require('../../../middlewares/studentAuth')
const processValue = require('../../../middlewares/processValue')
const Receipt = require('../../../Models/Payment')
const Subject = require('../../../Models/Subject')
const Request = require('../../../Models/Update')

router.post('/', 
            studentAuth, 
            processValue(['receiptID', 'subjectFrom', 'subjectTo']), 
            async(req,res)=>{
                try{
                    const receipt = await Receipt.findOne({receiptID: req.body.receiptID, rollNumber: req.student.rollNumber, isValid: false, isSuccess: true})
                    if(!receipt){
                        return res.status(406).send({errorMessage: 'No receipt was found'})
                    }
                    if(receipt.isPartialSuccess === false){
                        return res.status(406).send({errorMessage: 'Receipt is not Valid, contact collage'})
                    }
                    if(!req.body.subjectFrom && !req.body.subjectTo){
                        return res.status(406).send({errorMessage: 'Subjects not found'})
                    }
                    let isInNotes = false
                    receipt.notes.forEach(note => {
                        let noteArray = note.split(':')
                        if(noteArray.length === 1 ){
                            isInNotes = noteArray[noteArray.length - 1].trim() === req.body.subjectFrom ? true:false
                        }else{
                            noteArray = noteArray.join().split(',').map(note => note.trim())
                            isInNotes = noteArray.includes(req.body.subjectFrom.trim())
                        }
                    })
                    if(!isInNotes){
                        return res.status(406).send({errorMessage: 'Subject not valid'})
                    }
                    const odd = [1,3,5]
                    const even = [2,4,6]
                    const evenOdd = (req.student.currentSemester)%2 
                    let validSems = evenOdd === 1 ? odd : even
                    validSems=validSems.filter(sem=> sem < req.student.currentSemester)
                    const subjects = await Subject.find({branch: req.student.branch, semester:{$in: validSems}})
                    let subOne = false
                    let subTwo = false
                    subjects.forEach(semSubject => {
                        if(semSubject.subjects.includes(req.body.subjectFrom.trim())){
                            if(!subOne) subOne = true
                        }
                        if(semSubject.subjects.includes(req.body.subjectTo.trim())){
                            if(!subTwo) subTwo = true
                        }
                    })
                    if(subOne === false || subTwo === false){
                        return res.status(406).send({errorMessage: 'Invalid subjects'})
                    }
                    const request = new Request({
                        receiptID : req.body.receiptID,
                        rollNumber: req.student.rollNumber,
                        branch : req.student.branch,
                        semester: req.student.currentSemester,
                        from : req.body.subjectFrom,
                        to : req.body.subjectTo,
                    })
                    await request.save()
                    return res.status(200).send({isSuccess: true})
                }catch(e){
                    console.log(e)
                    return res.status(400).send({errorMessage: 'Something went wrong'})
                }
            }
)


module.exports = router