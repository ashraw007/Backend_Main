const express = require('express')
const adminAuth = require('../../../middlewares/adminAuth')
const router = new express.Router()
const Student = require('../../../Models/Student')
const Setting = require('../../../Models/Settings')
const Receipt = require('../../../Models/Payment')
const moment = require('moment')

router.get('/',adminAuth, async(req,res)=>{
    try{
        const odd = [1,3,5,7,9]
        const even = [2,4,6,8,10]
        isSem =  moment().month() + 1 < 7 ? even : odd  

        //Chart One
        const paid = await Student.find({ currentSemester: { $in: isSem }}).countDocuments({hasPaid: true})
        let notPaid = await Student.find({hasPaid: false, currentSemester: { $in: isSem }}).select(['rollNumber'])
        notPaid = notPaid.map(notPaidRollNumber => { return notPaidRollNumber['rollNumber']})
        const loggedIn = await Receipt.countDocuments({rollNumber: {$in: notPaid}})
        const chartOneTotal = paid + notPaid.length
        const notLoggedIn = chartOneTotal - (loggedIn + paid)
        const chartOne = [paid, loggedIn, notLoggedIn]

        //Chart Two
        let computerRollNumber = await Student.find({currentSemester: {$in: isSem}, branch: 'Computer Engineering'}).select(['rollNumber'])
        computerRollNumber = computerRollNumber.map(obj => obj['rollNumber'])
        let computerPaid = await Receipt.find({rollNumber: {$in: computerRollNumber}, isSuccess: true}).select(['amount'])
        computerPaidAmount = 0
        computerPaid.map(paid => {computerPaidAmount = computerPaidAmount + (paid.amount / 100)})

        let autoRollNumber = await Student.find({currentSemester: {$in: isSem}, branch: 'Automobile Engineering'}).select(['rollNumber'])
        autoRollNumber = autoRollNumber.map(obj => obj['rollNumber'])
        let autoPaid = await Receipt.find({rollNumber: {$in: autoRollNumber}, isSuccess: true}).select(['amount'])
        autoPaidAmount = 0
        autoPaid.map(paid => {autoPaidAmount = autoPaidAmount + (paid.amount / 100)})

        let eceRollNumber = await Student.find({currentSemester: {$in: isSem}, branch: 'Electronics and Communication Engineering'}).select(['rollNumber'])
        eceRollNumber = eceRollNumber.map(obj => obj['rollNumber'])
        let ecePaid = await Receipt.find({rollNumber: {$in: eceRollNumber}, isSuccess: true}).select(['amount'])
        ecePaidAmount = 0
        ecePaid.map(paid => {ecePaidAmount = ecePaidAmount + (paid.amount / 100)})

        const chartTwo = [computerPaidAmount, autoPaidAmount, ecePaidAmount]

        //Chart Three 

        async function computer() {
            let [computerStudentYearOne, computerStudentYearTwo, computerStudentYearThree] = await Promise.all([Student.find({currentSemester: isSem[0], branch:'Computer Engineering', hasPaid: true}).select(['rollNumber']),Student.find({currentSemester: isSem[1], branch:'Computer Engineering', hasPaid: true}).select(['rollNumber']),Student.find({currentSemester: isSem[2], branch:'Computer Engineering', hasPaid: true}).select(['rollNumber'])])
            return{computerStudentYearOne, computerStudentYearTwo, computerStudentYearThree}
        }

        let computerStudentYrOne = [], computerStudentYrTwo = [], computerStudentYrThree = []

        await computer().then((data)=>{
            computerStudentYrOne = data.computerStudentYearOne.map(rollNo => rollNo.rollNumber)
            computerStudentYrTwo = data.computerStudentYearTwo.map(rollNo => rollNo.rollNumber)
            computerStudentYrThree = data.computerStudentYearThree.map(rollNo => rollNo.rollNumber)
        }).catch((err)=>{console.log(err)})


        async function auto() {
            let [autoStudentYearOne, autoStudentYearTwo, autoStudentYearThree] = await Promise.all([Student.find({currentSemester: isSem[0], branch:'Automobile Engineering', hasPaid: true}).select(['rollNumber']),Student.find({currentSemester: isSem[1], branch:'Automobile Engineering', hasPaid: true}).select(['rollNumber']),Student.find({currentSemester: isSem[2], branch:'Automobile Engineering', hasPaid: true}).select(['rollNumber'])])
            return{autoStudentYearOne, autoStudentYearTwo, autoStudentYearThree}
        }

        let autoStudentYrOne = [], autoStudentYrTwo = [], autoStudentYrThree = []
        
        await auto().then((data)=>{
            autoStudentYrOne = data.autoStudentYearOne.map(rollNo => rollNo.rollNumber)
            autoStudentYrTwo = data.autoStudentYearTwo.map(rollNo => rollNo.rollNumber)
            autoStudentYrThree = data.autoStudentYearThree.map(rollNo => rollNo.rollNumber)
        }).catch((err)=>{console.log(err)})

        async function ece() {
            let [eceStudentYearOne, eceStudentYearTwo, eceStudentYearThree] = await Promise.all([Student.find({currentSemester: isSem[0], branch:'Electronics and Communication Engineering', hasPaid: true}).select(['rollNumber']),Student.find({currentSemester: isSem[1], branch:'Electronics and Communication Engineering', hasPaid: true}).select(['rollNumber']),Student.find({currentSemester: isSem[2], branch:'Electronics and Communication Engineering', hasPaid: true}).select(['rollNumber'])])
            return{eceStudentYearOne, eceStudentYearTwo, eceStudentYearThree}
        }

        let eceStudentYrOne = [], eceStudentYrTwo = [], eceStudentYrThree = []
        
        await ece().then((data)=>{
            eceStudentYrOne = data.eceStudentYearOne.map(rollNo => rollNo.rollNumber)
            eceStudentYrTwo = data.eceStudentYearTwo.map(rollNo => rollNo.rollNumber)
            eceStudentYrThree = data.eceStudentYearThree.map(rollNo => rollNo.rollNumber)
        }).catch((err)=>{console.log(err)})

        var evenDate = new Date(moment().year(),1 ,01 );
        var oddDate = new Date(moment().year(), 7, 01);
        dated =  moment().month() + 1 < 7 ? evenDate : oddDate  

        const rollNumbers = [
            ...computerStudentYrOne, 
            ...computerStudentYrTwo, 
            ...computerStudentYrThree, 
            ...autoStudentYrOne, 
            ...autoStudentYrTwo, 
            ...autoStudentYrThree,
            ...eceStudentYrOne,
            ...eceStudentYrTwo,
            ...eceStudentYrThree
        ]

        const totalFromDatabase = await Receipt.find({rollNumber: {$in: rollNumbers}, isSuccess: true }).select(['amount'])
        const settings = await Setting.findOne({})
        let chartThreeTotal = 0
        totalFromDatabase.map(paid => {chartThreeTotal = chartThreeTotal + ( paid.amount / 100 ) })
        
        CY1 = settings.normalFee * computerStudentYrOne.length
        chartThreeTotal = chartThreeTotal - CY1
        CY2 = settings.normalFee * computerStudentYrTwo.length
        chartThreeTotal = chartThreeTotal - CY2
        CY3 = settings.normalFee * computerStudentYrThree.length
        chartThreeTotal = chartThreeTotal - CY3

        AY1 = settings.normalFee * autoStudentYrOne.length
        chartThreeTotal = chartThreeTotal - AY1
        AY2 = settings.normalFee * autoStudentYrTwo.length
        chartThreeTotal = chartThreeTotal - AY2
        AY3 = settings.normalFee * autoStudentYrThree.length
        chartThreeTotal = chartThreeTotal - AY3

        EY1 = settings.normalFee * eceStudentYrOne.length
        chartThreeTotal = chartThreeTotal - EY1
        EY2 = settings.normalFee * eceStudentYrTwo.length
        chartThreeTotal = chartThreeTotal - EY2
        EY3 = settings.normalFee * eceStudentYrThree.length
        chartThreeTotal = chartThreeTotal - EY3
         
        const chartThree = [
            {name: "Computer Engineering",data: [CY1,CY2,CY3]},
            {name: "Automobile engineering",data: [AY1,AY2,AY3]},
            {name: "Electronics and Communication Engineering",data: [EY1,EY2,EY3]},
            {name: "Back",data: [0,0,0,chartThreeTotal]},
        ]

        //Data 

        async function data (){
            let [
                compYrOne, compYrTwo, compYrThree,
                autoYrOne, autoYrTwo, autoYrThree,
                eceYrOne, eceYrTwo, eceYrThree
            ] = await Promise.all([
                Student.countDocuments({currentSemester: isSem[0], branch:'Computer Engineering'}),
                Student.countDocuments({currentSemester: isSem[1], branch:'Computer Engineering'}),
                Student.countDocuments({currentSemester: isSem[2], branch:'Computer Engineering'}),
                Student.countDocuments({currentSemester: isSem[0], branch:'Automobile Engineering'}),
                Student.countDocuments({currentSemester: isSem[1], branch:'Automobile Engineering'}),
                Student.countDocuments({currentSemester: isSem[2], branch:'Automobile Engineering'}),
                Student.countDocuments({currentSemester: isSem[0], branch:'Electronics and Communication Engineering'}),
                Student.countDocuments({currentSemester: isSem[1], branch:'Electronics and Communication Engineering'}),
                Student.countDocuments({currentSemester: isSem[2], branch:'Electronics and Communication Engineering'})
            ])
            return{  compYrOne, compYrTwo, compYrThree,
                autoYrOne, autoYrTwo, autoYrThree,
                eceYrOne, eceYrTwo, eceYrThree}
        }

        const accordionData = []
        await data().then((data)=>{
            yearOne ={
                year: "Year 1",
                batch: `${moment().year()} - ${moment().year()+1}`,
                branches: [
                    {
                        branch:  "Computer Engineering",
                        total: data.compYrOne,
                        paid: computerStudentYrOne.length
                    },
                    {
                        branch:  "Automobile Engineering",
                        total : data.autoYrOne,
                        paid: autoStudentYrOne.length
                    },
                    {
                        branch:  "Electronics and Communication Engineering",
                        total: data.eceYrOne,
                        paid: eceStudentYrOne.length
                    }   
                ]
            },
            yearTwo ={
                year: "Year 2",
                batch: `${moment().year() - 1} - ${moment().year()}`,
                branches: [
                    {
                        branch:  "Computer Engineering",
                        total: data.compYrTwo,
                        paid: computerStudentYrTwo.length
                    },
                    {
                        branch:  "Automobile Engineering",
                        total : data.autoYrTwo,
                        paid: autoStudentYrTwo.length
                    },
                    {
                        branch:  "Electronics and Communication Engineering",
                        total: data.eceYrTwo,
                        paid: eceStudentYrTwo.length
                    } 
                ]    
            },
            yearThree ={
                year: "Year 3",
                batch: `${moment().year() - 2} - ${moment().year() -1}`,
                branches: [
                    {
                        branch:  "Computer Engineering",
                        total: data.compYrThree,
                        paid: computerStudentYrThree.length
                    },
                    {
                        branch:  "Automobile Engineering",
                        total : data.autoYrThree,
                        paid: autoStudentYrThree.length
                    },
                    {
                        branch:  "Electronics and Communication Engineering",
                        total: data.eceYrThree,
                        paid: eceStudentYrThree.length
                    } 
                ]  
            }
            accordionData.push(yearOne)
            accordionData.push(yearTwo)
            accordionData.push(yearThree)
        })

        //Notices - already from notices
        let settingsObj = settings.toObject()
        settingsObj.notices = settingsObj.notices.map(notice => { return {title: notice.title, desc: notice.desc}} )

        res.status(200).send({
            chartOne,
            chartTwo,
            chartThree,
            accordionData,
            notices: settingsObj.notices
        })
    }catch(e){
        console.log(e)
        res.status(400).send({errorMessage: 'Something went wrong !'})
    }
})



module.exports = router 