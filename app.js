import express, { urlencoded } from "express";
import cors from 'cors'
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import User from "./models/User.js";


mongoose.connect('mongodb+srv://krish-node:Krishna8686@cluster0.emvic.mongodb.net/fitAuth?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('Db connected successfully')})
.catch((error) => console.log('Db has connection error'))
const app = express();
app.use(express.json())
app.use(urlencoded(true))
app.use(cors())

const SECRET = 'xyzxyzxyz';

app.post('/user/signup', async(req, res)=> {
    const { email, password, confirmPassword, firstName, lastName } = req.body

    try {
        const existingUser = await User.findOne({ email })
        const userProfile = await ProfileModel.findOne({ userId: existingUser?._id })

        if(existingUser) return res.status(400).json({ message: "User already exist" })

        if(password !== confirmPassword) return res.status(400).json({ message: "Password don't match" })
        
        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`})

        const token = jwt.sign({ email: result.email, id: result._id }, SECRET, { expiresIn: "1h" })
        
        res.status(200).json({ result, userProfile, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong"}) 
    }
})



app.post('/user/signin', async (req, res)=> {
    const { email, password } = req.body //Coming from formData

    try {
        const existingUser = await User.findOne({ email })
        
        //get userprofile and append to login auth detail
        const userProfile = await ProfileModel.findOne({ userId: existingUser?._id })

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })

        const isPasswordCorrect  = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"})

        //If crednetials are valid, create a token for the user
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET, { expiresIn: "1h" })
        
        //Then send the token to the client/frontend
        res.status(200).json({ result: existingUser, userProfile, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong"})
    }
})








app.listen(5000,()=>{
    console.log('Server live on port 5000')
})