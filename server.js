const express = require('express')
const app = express()

const bcrypt = require('bcryptjs')
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const port = 3000;
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'xbyte'
})

// app.get('/', (req, res)=>{
//     const token = localStorage.getItem('token')


// })

app.get('/register', (req, res)=>{
    const username = req.query.username;
    const password = req.query.password;

    if(!username || !password){
        return res.status(500).send('You missed somethin in parameters')
    }

    bcrypt.hash(password, 10, (err, hashedPassword)=>{
        if(err){
            res.status(500).send('Error')
            return console.log("Error")
        }

        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(sql, [username, hashedPassword], (err, result)=>{
            if(err){
                return res.status(500).send('DB Error')
            }

            res.send(`User registrated successfully, username: ${username} | password: ${hashedPassword}`)
        })
    })
})

app.get('/login', (req, res)=>{
    const username = req.query.username;
    const password = req.query.password;

    if(!username || !password){
        return res.status(500).send('You missed somethin in parameters')
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, result)=>{
        if(err){
            return res.status(500).send('Some error in DB')
        }

        const user = result[0]

        bcrypt.compare(password, user.password, (err, isMatch)=>{
            if(err){
                return res.status(500).send('Some error in hashing')
            }

            if(isMatch) {
                const user = {
                    username: username
                }

                const secretKey = 'mySecretKey#00'

                const token = jwt.sign(user, secretKey, { expiresIn: '1h' })

                return res.json({
                    token: token
                })
            } else {
                return res.status(400).send('Incorrect password')
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