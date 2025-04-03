const express = require('express')
const app = express()

const bcrypt = require('bcryptjs')
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const port = 3000;
// const host = "0.0.0.0"
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'xbyte'
})

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

const verifyToken = require('./verifyToken')

app.get('/protected', verifyToken, (req, res)=>{
    return res.json({
        message: 'This is a protected route',
        user: req.user
    })
})

app.post('/register', (req, res)=>{
    const { username, password } = req.body;

    if(!username || !password){
        return res.json('You missed somethin in parameters')
    }

    bcrypt.hash(password, 10, (err, hashedPassword)=>{
        if(err){
            res.json({
                message: 'Error in hashing'
            })
        }

        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(sql, [username, hashedPassword], (err, result)=>{
            if(err){
                return res.json({
                    message: 'DB Error'
                })
            }

            return res.json(`User registrated successfully, username: ${username} | password: ${hashedPassword}`)
        })
    })
})

app.post('/login', (req, res)=>{
    const { username, password } = req.body;

    if(!username || !password){
        return res.json( {
            message: 'You missed somethin in parameters'
        })
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, result)=>{
        if(err){
            return res.json({
                message: 'Some error in DB'
            })
        }

        if(result.length === 0){
            return res.json({
                message: "User not found"
            })
        }

        const user = result[0]

        bcrypt.compare(password, user.password, (err, isMatch)=>{
            if(err){
                return res.status(500).send('Some error in hashing')
            }

            if(isMatch) {
                const payload = {
                    id: user.id,
                    username: username
                }

                const secretKey = 'mySecretKey#00'

                const token = jwt.sign(payload, secretKey, { expiresIn: '1d' })

                return res.json({
                    token: token
                })
            } else {
                return res.json({
                    message: 'Incorrect password'
                })
            }
        })
    })
})

app.get('/new', (req, res)=>{
    const username = req.query.username;
    const name = req.query.name;
    const content = req.query.content;

    if(!username || !name || !content){
        return res.json({
            message: 'You missed somethin in parameters'
        })
    }

    
    if(!fs.existsSync(username)) {
        fs.mkdirSync(username)
    }

    const filename = name + '.txt'
    const pathFile = path.join(username, name)

    fs.writeFile(pathFile, content, (err)=>{
        if(err){
            return console.log(err)
        }
    })

    res.json({
        message: 'Content created'
    })
})

app.listen(port, ()=>{
    console.log(`Server: http://localhost:${port}`)
})