module.exports = function(error) {
    if(error.code === 11000 && error.name === "BulkWriteError"){
        const keyValueError = error.writeErrors[0].errmsg.split('{ ')[1].split(':')
        const key = keyValueError[0]
        const value = keyValueError[1].trim().replace(' }','')
        return({error: {
            errMsg: "Duplicate Value",
            [key] : value,
            previouslyInsetedDocuments: error.result.nInserted
        }})
    }
    if(error.errors){
        const errorKeyValue = []
        try{
            for (const errorKey in error.errors) {
                const errorObj = {}
                if(error.errors[errorKey].kind === "Boolean"){
                    errorObj[error.errors[errorKey].path] = error.errors[errorKey].reason.value,
                    errorObj["message"] = "Accepts only true/false"
                    errorKeyValue.push(errorObj)
                }else if(error.errors[errorKey].properties.type === "enum"){
                    errorObj[error.errors[errorKey].properties.path] = error.errors[errorKey].properties.value,
                    errorObj["message"] = `${error.errors[errorKey].properties.value} is not a valid value for ${error.errors[errorKey].properties.path}` 
                    errorKeyValue.push(errorObj)
                }else if(error.errors[errorKey].properties.type === "minlength" || error.errors[errorKey].properties.type === "maxlength"){
                    errorObj[error.errors[errorKey].properties.path] = error.errors[errorKey].properties.path === "password" ? "******" : error.errors[errorKey].properties.value,
                    errorObj["message"] = `${error.errors[errorKey].properties.type} for ${error.errors[errorKey].properties.path} is ${error.errors[errorKey].properties.minlength || error.errors[errorKey].properties.maxlength }` 
                    errorKeyValue.push(errorObj)
                }else{
                errorObj[error.errors[errorKey].properties.path] = error.errors[errorKey].properties.value || "No value provided",
                errorObj["message"] = error.errors[errorKey].message
                errorKeyValue.push(errorObj)
            }
        }
        }catch(e){
            errorKeyValue={error:"Contact Admin !"} 
        }
        return {error: {
            ...errorKeyValue
        }}
    }
    return error
}
