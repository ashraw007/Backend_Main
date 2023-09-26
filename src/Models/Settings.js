const mongoose = require('mongoose')

const settingSchema =  new mongoose.Schema({
    notices:[{
            title:{
                type: String,
                sparse: true,
                trim:true,
                maxlength: 1000,
                size: 10000,
            },
            desc:{
                type: String,
                sparse: true,
                trim:true,
                maxlength: 2000,
                size: 20000
            }
    }],
    normalFee:{
        type:Number,
        required: true,
        maxlength: 4,
        minlength: 1,
        default: 200,
        size: 20000
    },
    backExamFee:{
        type:Number,
        required: true,
        maxlength: 4,
        minlength: 1,
        default: 100,
        size: 20000
    },
    maxPerSemesterFee:{
        type:Number,
        required: true,
        maxlenth: 4,
        default:400,
        size: 20000
    },
    minLateFeeDate: {
        type:Date,
        required: true,
        default: Date.now() + 86400000,
        size: 20000,
    },
    maxLateFeeDate: {
        type:Date,
        required: true,
        default: Date.now() + (86400000*2),
        size: 20000,
    },
    minLateFee: {
        type:Number,
        required: true,
        maxlength: 4,
        default:100,
        size: 20000
    },
    maxLateFee:{
        type:Number,
        required: true,
        maxlength: 4,
        default:300,
        size: 20000
    }
},{timestamps: true})


settingSchema.methods.toJSON = function () {
    const settings = this
    const settingsObj = settings.toObject()
    
    delete settingsObj._id
    delete settingsObj.createdAt
    delete settingsObj.updatedAt

    return settingsObj
}

const Setting = mongoose.model('Setting', settingSchema)

module.exports = Setting