const colors = require('colors')

colors.setTheme({
    info: 'blue',
    warn: 'yellow',
    success: 'green',
    error: 'red'
});


const fallBack = (statusCode, by, operationName, descCode) => {
    if(statusCode >= 200 && statusCode < 300) {
        if (statusCode === 204) {
            console.log(colors.bgBlue.black.bold("Updated"))
            console.log(colors.info(statusCode, by, operationName, descCode))
        } else { 
            console.log(colors.bgGreen.black.bold("Success"))
            console.log(colors.success(statusCode, by, operationName, descCode))
        }
    }else if(statusCode >= 400 && statusCode < 500 ) {
        console.log(colors.bgYellow.black.bold("Warning"))
        console.log(colors.warn(statusCode, by, operationName, descCode))
    }else if(statusCode >= 500) {
        console.log(colors.bgRed.black.bold("Error"))
        console.log(colors.error(statusCode, by, operationName, descCode))
    }
}

module.exports = fallBack