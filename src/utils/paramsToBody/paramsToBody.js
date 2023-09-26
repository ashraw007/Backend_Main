const paramsToBody = (allowedValues) => {
    return function(req,res,next) {
        let validObj = req.query
        values = Object.keys(req.query)
    
        values.forEach(value => {
            if (!allowedValues.includes(value)) {
                delete validObj[value]
            }
            Object.assign(req.body,{[value] : validObj[value]})
        });
        next()
    } 
}

module.exports= paramsToBody