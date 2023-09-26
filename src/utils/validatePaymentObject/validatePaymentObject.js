const Subjects = require('../../Models/Subject')

const validatePaymentObject = async(req,res,next) => {
    if(!req.student || (!req.body.subjects && !req.body.semester)){
        return res.status(406).send({errorMessage: 'Invalid Body'})
    }
    if(req.body.semester){
        if(req.student.currentSemester !== req.body.semester){
            return res.status(406).send({errorMessage: 'Invalid Semester'})
        }
    }
   
    try{
        for(let i = 0; i<req.body.subjects.length;i++){
            const AllowedSubjects = await Subjects.findOne({semester: req.body.subjects[i].semester, branch: req.student.branch})
            const AllowedValues = req.body.subjects[i].subjects.every(subject => AllowedSubjects.subjects.includes(subject))
            if(!AllowedValues){
                return res.status(406).send({errorMessage:'Invalid Subjects'})
            }
        }
        next()
    }catch(e){
        return res.status(400).send({errorMessage: 'Invalid Body'})
    }
}

module.exports= validatePaymentObject