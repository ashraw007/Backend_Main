const express = require('express')
const Admin = require('../../Models/Admin')
const router = express.Router()
const {encrypt, decrypt} = require('../../utils/textEncryption/textEncrypt')
const adminAuth = require('../../middlewares/adminAuth')
const processValue = require('../../middlewares/processValue')
const { resetPassword } = require('../../utils/email/email')

router.post('/login', processValue(['ID', 'password']),async(req,res)=>{
    try{
        const admin = await Admin.findByCredentials(req.body)
        token = await admin.generateAuthToken()
        token = encrypt(token)
        res.cookie('token', token, {
            expires: new Date(Date.now() + 10800000),
            secure: true,
            httpOnly: false,
            sameSite: "None"
        })
        res.status(200).send({isSuccess: true})
    }catch(e){
        res.status(401).send({errorMessage: 'Incorrect Credentials'})
    }
})


router.delete('/logout',adminAuth, async(req,res)=>{
    try{
        req.admin.tokens = []
        await req.admin.save()
        res.clearCookie('token')
        res.clearCookie('name')
        res.status(204).send()
    }catch(e){
        console.log(e)
        res.clearCookie('token')
        res.status(400).send()
    }
})

router.post('/resetpwd',processValue(['adminID']) ,async(req,res)=>{
    let admin = {}
    try{
        admin = await Admin.recoverPassword(req.body.adminID)
        if(!admin.link){
           throw new Error()
        }
        resetPassword(admin.email, `${process.env.ADMIN_HOST}${admin.link}`)
        return res.status(200).send({message: "You will shortly receive an email !"})
    }catch(e){
        console.log(e)
        return res.status(400).send({errorMessage: 'Cant reset password now !'})
    }
})

router.patch('/resetpwd/:token', processValue(['password']), async(req,res)=>{
    try{
        const decryptedToken = decrypt(req.params.token)
        await Admin.resetPassword(decryptedToken, req.body.password)
        res.status(204).send({message: 'Password changed !'})
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Cannot reset password now !'})
    }
})



module.exports = router