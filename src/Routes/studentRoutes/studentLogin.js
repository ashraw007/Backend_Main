const express = require('express')
const router = new express.Router()
const processValue = require('../../middlewares/processValue')
const Student = require('../../Models/Student')
const {encrypt, decrypt} = require('../../utils/textEncryption/textEncrypt')
const studentAuth = require('../../middlewares/studentAuth')
const { resetPassword } = require('../../utils/email/email')

router.post('/login', 
            processValue(['rollNumber', 'password']), 
            async(req,res)=>{
                try{
                    const student = await Student.findByCredentials(req.body)
                    token = await student.generateAuthToken()
                    token = encrypt(token)
                    res.cookie('token', token, {
                        expires: new Date(Date.now() + 10800000),
                        path: "/"
                    })
                    res.status(200).send({isSuccess: true})
                }catch(e){
                    res.status(401).send({errorMessage: 'Incorrect Credentials'})
                }
})

router.delete('/logout', studentAuth, async(req,res)=>{
    try{
        req.student.tokens = []
        await req.student.save()
        res.clearCookie('token')
        res.clearCookie('name')
        res.status(204).send()
    }catch(e){
        console.log(e)
        res.clearCookie('token')
        res.status(200).send()
    }
})

router.post('/resetpwd',processValue(['rollNumber']) ,async(req,res)=>{
    let student = {}
    try{
        student = await Student.recoverPassword(req.body.rollNumber)
        if(!student.link){
           throw new Error()
        }
        resetPassword(student.email, `${process.env.STUDENT_HOST}${student.link}`)
        return res.status(200).send({message: "You will shortly receive an email !"})
    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: 'Cant reset password now !'})
    }
})

router.patch('/resetpwd/:token', processValue(['password']), async(req,res)=>{
    try{
        const decryptedToken = decrypt(req.params.token)
        await Student.resetPassword(decryptedToken, req.body.password)
        res.status(204).send({message: 'Password changed !'})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Cannot reset password now !'})
    }
})

module.exports = router