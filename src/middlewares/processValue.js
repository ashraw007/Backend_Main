const processValue = (allowedValues) => {
    return function(req,res,next){
        let validObj = req.body
        values = Object.keys(req.body)
    
        values.forEach(value => {
            if (!allowedValues.includes(value)) {
                delete validObj[value]
            }
        });
        next()
    }
}

module.exports = processValue