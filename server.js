const express = require('express')
const bcrypt = require('bcrypt')
const app = express()

const users = []

app.use(express.json())
//to display user deatail(Name and Password)
app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
    try {
        const hashedpassword = await bcrypt.hash(req.body.password, 10)
        const user = {
            "name": req.body.name,
            "password": hashedpassword
        }
        users.push(user);
        res.status(201).send()
    }
    catch {
        res.status(500).send()
    }
})

app.delete('/users/delete', (req, res) => {
    res.send("Data deleted")
    users.pop();
})


//Login
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name)
    console.log("login user ", user)
    if (user == undefined)
        return res.status(400).send("Cannot find user ", req.body.name);
    try {
        console.log("A\n", req.body.password)
        console.log("B\n", user.password)
        if (await bcrypt.compare(req.body.password, user.password)) {
        // if (req.body.password == user.password) {
            res.status(200).send("Success")
        }
        else {
            res.status(200).send("Failure")
        }
    }
    catch (err) {
        res.status(500).send("Cannot login")
    }
})

app.listen(8080)