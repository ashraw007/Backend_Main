const express = require('express')
const router = new express.Router()
const Student = require('../../../Models/Student')
const Request = require('../../../Models/Update')
const processValue = require('../../../middlewares/processValue')
const multer = require('multer')
const paramsToBody= require('../../../utils/paramsToBody/paramsToBody')
const { encrypt , decrypt } = require('../../../utils/fileEncrypt/fileEncrypt')
const adminAuth = require('../../../middlewares/adminAuth')
const logger = require('../../../logger/logger')
const errorHandler = require('../../../utils/errorHandler/errorHandler')

const gtbpiFileUpload = multer({
    limits: {
        fileSize: 500000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.gtbpi$/)) {
            return cb('upload gtbpi file please', undefined)
        }
        cb(undefined, true)
    }
})
const gtbpiFile = gtbpiFileUpload.single('data')

router.post('/' ,adminAuth, async (req,res)=>{
    gtbpiFile(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            logger(406, req.admin.adminID,  ' Add students ', 3)
            return res.status(415).send({ errorMessage: 'Please try again !' })
        } else if (err) {
            logger(406, req.admin.adminID,  ' Add students ', 3)
            return res.status(406).send({ errorMessage: 'Please try again !' })
        }
        try{
            data = await decrypt(req.file.buffer)
            req.data = JSON.parse(data.toString())
            const saved = await Student.insertMany(req.data)
            res.status(200).send({success: true})
            logger(200, req.admin.adminID, ' Add students ', 1)
        }catch(e){
            res.status(400).send({errorMessage: 'Please try again !',error: errorHandler(e)})
            logger(400, req.admin.adminID,  ' Add students ', 3)
        }
    })
})

router.post('/encryptData', processValue(['data']),async(req,res)=> {

    //Making ForEach support Async
    Array.prototype.asyncForEach = async function forEach(callback, thisArg) {
        if (typeof callback !== "function") {
          throw new TypeError(callback + " is not a function");
        }
        var array = this;
        thisArg = thisArg || this;
        for (var i = 0, l = array.length; i !== l; ++i) {
          await callback.call(thisArg, array[i], i, array);
        }
      };


    let valError = 0
    try{
        if(typeof(req.body.data) === "string"){
            req.body.data = JSON.parse(req.body.data)
        }
        await req.body.data.asyncForEach(async(data,index) => {
            if(valError === 1){
                return false;
            }
            req.body.data[index].rollNumber  = parseInt(data.rollNumber)
            req.body.data[index].currentSemester = parseInt(data.currentSemester)
            req.body.data[index].isLateralEntry = data.isLateralEntry === "TRUE" ? true : false
            req.body.data[index].phoneNumber = parseInt(data.phoneNumber)
            req.body.data[index].branch = data.branch.charAt(0).toUpperCase() + data.branch.slice(1)
            await Student.validate(data).then().catch(err=>{
                valError = 1
                return res.send(errorHandler(err))})
            return true
        })
        
        if(valError !== 1){
            const JSONbuffer = Buffer.from(JSON.stringify(req.body.data))
            const file = await encrypt(JSONbuffer)
            res.set('Content-Type', 'application/gtbpi')
            res.status(200).send(file)
        }        
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'something went wrong, please try again !'})
    }
})

router.patch('/resetPwdStudent',adminAuth, processValue(['rollNumber']), async(req,res)=>{
    try{
        let student = await Student.findOne({rollNumber: req.body.rollNumber})
        if(!student){
            logger(406, req.admin.adminID,  ' Reset student password ', 3)
            return res.status(406).send({errorMessage: 'something went wrong'})
        }
        student.password = `${student.name.substring(0,4)}${student.rollNumber.toString().substring(6,10)}`
        student = await student.save()
        if(!student){
            logger(406, req.admin.adminID,  ' Reset student password ', 3)
            return res.status(406).send({errorMessage: 'something went wrong'})
        }
        res.status(200).send({success: true})
        logger(200, req.admin.adminID, '  Reset student password ', 1)
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Something went wrong'})
        logger(400, req.admin.adminID,  '  Reset student password  ', 3)
    }
})

router.delete('/batch', adminAuth, processValue(['batch']), async(req,res)=>{
    try{
        if(typeof(req.body.batch) !== "string" || req.body.batch.split("|").length !== 4) throw new Error()
        req.body.batch = req.body.batch.split("|")
        const branch = req.body.batch[0]
        const timing = req.body.batch[1]
        const batch = req.body.batch[2]
        const currentSemester = req.body.batch[3]
        await Student.deleteMany({branch: branch.trim(), timing: timing.trim(), batch: batch.trim(), currentSemester: currentSemester})
        res.status(200).send({success: true, batch: req.body.batch.join( "|")})
        logger(204, req.admin.adminID,  ' Deleted students [ Batch ] ', 2)
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: "Something went wrong"})
        logger(400, req.admin.adminID,  ' Deleted students [ Batch ] ', 3)
    }
})

router.delete('/', adminAuth, processValue(['students']), async(req,res)=>{
    try{
        if(typeof(req.body.students) !== "object") throw new Error()
        const isTrue = req.body.students.every(student => typeof(student) === "number")
        if(!isTrue) throw new Error()
        const removed = await Student.deleteMany({rollNumber: {$in: req.body.students}})
        res.status(200).send({success: true}) 
        logger(200, req.admin.adminID, ' Delete students [ Individually ] ', 1)
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage:"something went wrong"})
        logger(400, req.admin.adminID,  '  Delete students [ Individually ] ', 3)
    }
})

router.patch('/incSem', adminAuth, async(req,res)=>{
    try{
        const updated = await Student.updateMany({currentSemester: {$lt: 6}}, { $inc: {'currentSemester': 1}, hasPaid: false })
        await Request.collection.drop()
        res.status(200).send({success: true})
        logger(200, req.admin.adminID, ' Increment semester ', 1)
    }catch(e){
        console.log(e)
        if(e.code === 26){
            return res.status(400).send({errorMessage: 'Looks like semester was already increased'})
        }
        res.status(400).send({errorMessage: 'Something went wrong'})
        logger(400, req.admin.adminID,  ' Increment semester ', 3)
    }
})

router.patch('/passHold', adminAuth, processValue(['students', 'type']) ,async(req,res)=>{
    try{
        if(typeof(req.body.students) !== "object" || typeof(req.body.type) !== "string") throw new Error()
        const validRollNumbers = req.body.students.every(student => typeof(student) === "number")
        const validType = req.body.type === "pass" || req.body.type === "hold" 
        if(!validRollNumbers || !validType) throw new Error()

        if(req.body.type === "pass"){
            const removed = await Student.deleteMany({rollNumber: {$in: req.body.students}, currentSemester:{$gt: 5}})
            res.status(200).send({success: true, type:"pass"}) 
            logger(200, req.admin.adminID, ' Pass/Hold students ', 1)
        }
        if(req.body.type === "hold"){
            const updated = await Student.updateMany({rollNumber: {$in: req.body.students}, currentSemester:{$gt: 5}}, {$inc: {'currentSemester': 1}, hasPaid: false })
            res.status(200).send({success: true, type: "hold"}) 
            logger(204, req.admin.adminID, ' Pass/Hold students ', 2)
        }
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Something went wrong'})
        logger(400, req.admin.adminID,  ' Pass/Hold students ', 3)
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
        studentData.map((student,index) => {
            let data = {...student._doc}
            
            delete data._id
            delete data.password
            delete data.tokens
            delete data.__v
            delete data.createdAt
            delete data.updatedAt
            delete data.resetPasswordToken
        })
        res.status(200).send({students: studentData})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Cant get data now, please try again later !'})
    }
})


module.exports = router