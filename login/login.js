const express = require('express')
const app = express()

const bcrypt = require('bcryptjs')
const cors = require('cors')
const mysql = require('mysql2')

const port = 3000;
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'xbyte'
})

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
                return res.send('Successfull login')
            } else {
                return res.status(400).send('Incorrect password')
            }
        })
    })
})

app.listen(port, ()=>{
    console.log(`Server: http://localhost:${port}`)
})

//Building your first login system is a huge achievement! 🚀 It’s one of the foundational pieces of many web applications, and you're on the right path. Continue experimenting, building new features, and learning about different technologies to improve your project!