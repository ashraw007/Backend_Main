const mongoose = require('mongoose')

const semesterSchema = new mongoose.Schema({
    rollNumber: {
        type: Number,
        required: [true, "Please provide a roll number"],
        max: 10,
        min: 10,
        unique: true,
    },
    semesters: [{
        semester: {
            number: {
                type: Number,
                required: true,
                enum:[1,2,3,4,5,6,7,8,9,10],
                max:2
            },
            paid: {
                type: Boolean,
                required: true,
                default: false
            },
            orderId: {
                type: String,
                max:255,
                sparse:true,
                trim:true
            },
            backlogs:{
                type: Array,
            },
            isAccepted: {
                type: Boolean,
                required: false,
                default: false
            },
            isAppliedForChange:{
                type:Boolean,
                sparse:true,
                default: false
            },
            isChanged: {
                type: Boolean,
                sparse:true,
                default: false
            },
            isLate:{
                type:Boolean,
                required:true,
                default: false
            },
            lateFeePaid:{
                type:Number,
                max:3,
                sparse: true
            }
        }
    }]
}, {timestamps: true})

const Semester = mongoose.model('Semester', semesterSchema)

module.exports = Semester