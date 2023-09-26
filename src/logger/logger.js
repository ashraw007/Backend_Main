const Log = require('../Models/Logs')

const fallBack = require('./fallback')


decsCodes = {
    1: "Task Completed successfully !",
    2: "Update successfully !",
    3: "Oops the action failed ! Something went Wrong",
    4: "Server Error ! cant handle the request now !"
}

const logger = async (statusCode, by, operationName, descCode) => {
    try{
        const log = await Log({statusCode, by, operationName, desc: decsCodes[descCode]}).save()
        if(!log){
            fallBack(statusCode, by, operationName, descCode)
        }
    }catch(e){
        fallBack(statusCode, by, operationName, descCode)
    }
}

module.exports = logger
