const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if(!token){
        return res.status(404).json({
            message: 'Token is required'
        })
    }

    jwt.verify(token, secretKey, (err, decoded)=>{
        if(err){
            return res.status(404).json({
                message: 'Token has expired or not found'
            })
        }

        req.user = decoded;
        next()
    })
}

module.exports = verifyToken