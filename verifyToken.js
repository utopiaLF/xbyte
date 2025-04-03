const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if(!token){
        return res.status(404).json({
            message: 'Token is required'
        })
    }

    const secretKey = 'mySecretKey#00'

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