const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const {encrypt} = require('../utils/textEncryption/textEncrypt')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'No Name was provided'],
        trim: true,
        minlenth: 4,
        maxLenth: 255,
        validate(value){
            const regexp = new RegExp(/^[a-z]([-']?[a-z]+)*|( [a-z]([-']?[a-z]+)*)+$/i)
            if (!regexp.test(value)) {
                throw new Error('Please provide name')
            }
        }
    },
    batch: {
        type: String,
        required: [true, "Please provide a batch"],
        trim: true,
        minlenth: 9,
        maxLenth: 9,
        validate(value) {
            const regexp = new RegExp(/^((20)\d{2})-((20)\d{2})$/i)
            if(regexp.test(value)){
                const years = value.split('-')
                if(parseInt(years[1])-parseInt(years[0]) !== 3){
                    throw new Error('Invalid batch years')
                }
            }else{
                throw new Error('Invalid batch years')
            }
        }
    },
    currentSemester: {
        type: Number,
        required: true,
        enum: [1,2,3,4,5,6,7,8,9,10],
        maxLenth:2
    },
    rollNumber: {
        type: Number,
        required: [true, "Please provide a roll number"],
        maxLength: 10,
        minlength: 10,
        unique: true,
        validate(value){
            if(value.toString().length !== 10){
                throw new Error("Roll Number length has to be 10")
            }
        }
    },
    phoneNumber: {
        type: Number,
        required: [true, "Please provide a phone number"],
        minlength:10,
        maxLength:10,
        unique: true, //true
        validate(value){
            if(!validator.isMobilePhone(value.toString(),["en-IN"])){
                throw new Error('Please provide a valid phone number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, //true
        lowercase: true,
        maxLength: 255,
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
        maxLength: 122
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
    isLateralEntry: {
        type:Boolean,
        required: true,
    },
    branch:{
        type: String,
        required: true,
        enum: ['Computer Engineering', 'Automobile Engineering', 'Electronics and Communication Engineering']
    },
    timing: {
        type: String,
        required: true,
        enum:['Morning', 'Evening']
    },
    hasPaid: {
        type:Boolean,
        defaut:false,
    }
}, {timestamps: true})

studentSchema.statics.findByCredentials = async({rollNumber ,password}) => {
    const student = await Student.findOne({rollNumber})

    if(!student){
        throw new Error()
    }

    const isMatch = await bcrypt.compare(password, student.password)

    if (!isMatch) {
        throw new Error()
    }

    return student
}


studentSchema.statics.recoverPassword = async (rollNumber) => {
    try{
        const student = await Student.findOne({rollNumber})
        if(!student){throw new Error()}
        let token = jwt.sign({id: student._id, email: student.email}, process.env.JWT_TOKEN, {expiresIn: 600000})
        token = encrypt(token)
        student.resetPasswordToken = token
        await student.save()
        return ({link: `/reset-password/${token}`, email: student.email})
    }catch(e){
        return ({error: 'cant reset password now, Please try again later'})
    }
}

studentSchema.statics.resetPassword = async (token , password) => {
    try{
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
        const student = await Student.findOne({_id:decoded.id, email: decoded.email})
        if(!student){throw new Error()}
        if(!student.resetPasswordToken){throw new Error()}
        student.password = password
        student.resetPasswordToken = undefined
        student.tokens = []
        await student.save()
    }catch(e){
        throw new Error()
    }
    
}

studentSchema.methods.generateAuthToken = async function(){
    const student = this
    const token = jwt.sign({_id: student._id.toString()}, process.env.JWT_TOKEN, {expiresIn: '3h'})
    student.tokens = student.tokens.concat({token})
    await student.save()
    return token 
}

studentSchema.methods.toJSON = function () {
    const student = this
    const studentObj = student.toObject()

    delete studentObj._id
    delete studentObj.isLateralEntry
    delete studentObj.password
    delete studentObj.tokens
    delete studentObj.email
    delete studentObj.__v
    delete studentObj.createdAt
    delete studentObj.updatedAt

    return studentObj
}


studentSchema.pre('insertMany', async function (next, docs){
    try{
        for(let i=0;i<docs.length;i++){
            docs[i].password = await bcrypt.hash(docs[i].password, 12)
        }
        next()
    }catch(e){
        console.log(e)
    }
})

studentSchema.pre('save', async function (next){
    const student = this
    if (student.isModified('password')) {
        student.password = await bcrypt.hash(student.password, 12)
    }
    next()
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student