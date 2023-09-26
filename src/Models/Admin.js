const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const {encrypt} = require('../utils/textEncryption/textEncrypt')

const adminSchema = new mongoose.Schema({
    adminID: {
        type: String,
        max: 255,
        min: 5,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        max: 255,
        min: 4,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        sparse: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        maxlength: 64
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    resetPasswordToken: {
        type: String
    },
    allowOperations: {
        type: Boolean,
        required: true,
        default: true
    }
},{timestamps: true})

adminSchema.statics.findByCredentials = async({ID ,password}) => {
    const admin = await Admin.findOne({adminID: ID})

    if(!admin){
        throw new Error()
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
        throw new Error()
    }

    return admin
}

adminSchema.methods.generateAuthToken = async function(){
    const admin = this
    const token = jwt.sign({_id: admin._id.toString()}, process.env.JWT_TOKEN, {expiresIn: '3h'})
    admin.tokens = admin.tokens.concat({token})
    await admin.save()
    return token 
}


adminSchema.statics.recoverPassword = async (adminID) => {
    try{
        const admin = await Admin.findOne({adminID})
        if(!admin){throw new Error()}
        let token = jwt.sign({id: admin._id, email: admin.email}, process.env.JWT_TOKEN, {expiresIn: 600000})
        token = encrypt(token)
        admin.resetPasswordToken = token
        await admin.save()
        return ({link: `/reset-password/${token}`, email: admin.email})
    }catch(e){
        return ({error: 'cant reset password now, Please try again later'})
    }
}

adminSchema.statics.resetPassword = async (token , password) => {
    try{
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
        const admin = await Admin.findOne({_id:decoded.id, email: decoded.email})
        if(!admin){throw new Error()}
        if(!admin.resetPasswordToken){throw new Error()}
        admin.password = password
        admin.resetPasswordToken = undefined
        admin.tokens = []
        await admin.save()
    }catch(e){
        throw new Error()
    }
    
}


adminSchema.pre('save',async function (next){
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 12)
    }
    next()
} )

const Admin = mongoose.model('Admin', adminSchema)



module.exports = Admin