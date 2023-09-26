const keyAuth = async (req,res,next) => {
    if(!req.header('Authorization')){
       return res.status(401).send({Auth: 'Invalid request'})
    }
    if(!process.env.KEY){
        return res.status(401).send({Auth: 'Server Error'})
    }
    if ( (req.header('Authorization').replace('Bearer ', "")) !== process.env.KEY  ){
        return res.status(401).send({Auth : "Failed"})
    }
    next()
}

module.exports = keyAuth