const jwt = require('jsonwebtoken')
const {decrypt} = require('../utils/textEncryption/textEncrypt')
const Admin = require('../Models/Admin')

const adminAuth = async (req,res,next) => {
    try{
        // const token = req.header('Authorization').replace('Bearer ', '')

        let reqCookie = "" 
        req.headers.cookie.split(";").map(cookie => { 
            cookie = cookie.trim()
            if(cookie.substring(0,6) === "token="){ reqCookie = cookie}})
        const token = reqCookie.replace("token=", "").replace("%3A", ":") || '' 
        if(!token){
            return res.status(401).send({errorMessage: 'Please Authenticate'})
        }
        const decodedToken = decrypt(token)
        const decoded = jwt.verify(decodedToken, process.env.JWT_TOKEN)
        const admin = await Admin.findOne({_id: decoded._id, 'tokens.token':decodedToken})
        if(!admin){
            throw new Error()
        }
        if(admin.allowOperations === false){
            console.log(e)
            res.clearCookie('name')
            res.clearCookie('token').status(401).send({ errorMessage: 'Not allowed' })
        }
        req.token = token
        req.admin = admin
        res.cookie('name', admin.name)
        next()
    }catch(e){
        console.log(e)
        res.clearCookie('name')
        res.clearCookie('token').status(401).send({ errorMessage: 'Please Authenticate' })
    }
   
}

module.exports = adminAuth
