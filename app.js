const express = require("express")
const mongoose = require('mongoose')
const app = express();
const bcrypt = require("bcrypt")
const env = require('dotenv');
env.config()
const port = process.env.PORT;

app.use(express.json())

const db = async () =>{
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("database now connected")
    } catch (error) {
        console.log(error.message);
    }
}
db()

const Schema = new mongoose.Schema({
    Username : {
        type: String
    },
    Email : {
        type: String
    },
    Password : {
        type: String
    }
})
const User = mongoose.model("user", Schema)

app.get("/", (req, res)=> {
    res.send("welcome to my home page!");
    console.log("my web page created");
    
})

app.post("/signup", async (req, res)=> {
    // const username = req.body.username
    // const email = req.body.email
    // const password = req.body.password

    const { username, email, password} = req.body

    if(!username && !email && !password){
        return res.status(400).send("username, email, password required!");
    }

    hashedpassword = await bcrypt.hash(password, 10)

    const newCustomer = new User({
        Username: username,
        Email : email,
        Password : hashedpassword
    })
    const usercreated = await newCustomer.save()

    if (!usercreated){
        return res.status(500).send("could not save user")
    }else{
        return res.status(201).send("user created successfully")
    }

})

app.post('/login',async (req, res)=>{
    try {
        const {email,password} =req.body;

        const user = await User.findOne({email:email});

        if(!user){
            return res.status(400).json({msg: 'invalid password credentials'})
        }
    
    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        return res.status(400).json({msg: 'invalid password credentials'})
    }
    const datainfo = {
        email: user.user.email,
        password:user.password
    }
    return res.status(200).json({msg: 'logged in successfully', dataInfo})
    } catch (error) {
        
    }})



app.listen(port, (err)=>{
    console.log("now listening at http://localhost:"+port);  
})

  