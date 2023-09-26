const crypto = require('crypto')

const algorithm = process.env.ALGORITHM
const key = process.env.SECRET_KEY
const iv = process.env.IV;

async function encrypt(buffer) {
    try{
        var cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
        var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
        return crypted;
    }catch(e){
        console.log(e)
    }
    
}

async function decrypt(buffer) {
    try{
        var decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
        var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
        return dec;
    }catch(e){
        console.log(e)
    }
 
}

module.exports = {encrypt, decrypt}