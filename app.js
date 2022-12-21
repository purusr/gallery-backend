import express, { urlencoded } from "express";
import cors from 'cors'
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import User from "./models/User.js";
import Pics from "./models/Pics.js";


mongoose.connect('mongodb+srv://krish-node:Krishna8686@cluster0.emvic.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('Db connected successfully')})
.catch((error) => console.log('Db has connection error'))
const app = express();
app.use(express.json())
app.use(urlencoded(true))
app.use(cors())

const SECRET = 'xyzxyzxyz';


app.get('/', (req, res)=>{
    res.send('Gallery server is doing good.');
})

app.get('/getGallery',async(req,res)=>{
       const images = await Pics.find()
       res.json(images)
})

app.post('/createGallery', async(req, res)=>{
    const {imageurl} = req.body;
    console.log(imageurl)
    const CreateOne = new Pics({image_url: imageurl, likes: 0})
    try{
        await CreateOne.save()
        res.json({Success: 'Image uploaded'})
    }catch(error){
        res.json({Failed:'Image is not uploaded'})
    }
})

app.post('/updateLikes/:_id', async(req,res)=>{
    const {_id} = req.params;
    try{
        const picture = await Pics.findById(_id);
        const UpLikes = await Pics.findByIdAndUpdate(_id,{likes: picture.likes+1})
        res.json({Success: 'Liked'})
    }catch(error){
        res.json({Failed:'Something went wrong'})
    }
})

app.post('/updateComments/:_id', async(req, res)=>{
    const {_id} = req.params;
    const {comment}= req.body;
    try{
        const picture = await Pics.findById(_id);
        const UpLikes = await Pics.findByIdAndUpdate(_id,{comments: [...picture.comments, comment]})
        res.json({Success: 'Comment added'})
    }catch(error){
        res.json({Failed:'Something went wrong'})

    }
})

app.get('/getComment/:_id', async(req, res)=>{
    const {_id} = req.params;

    try{
        const comnts = await Pics.findById(_id);
        res.json(comnts)
    }catch(error){
        res.json({failed: 'Something went wrong'})
    }
})

app.post('/user/signup', async(req, res)=> {
    const { email, password, confirmPassword, firstName, lastName } = req.body

    try {
        const existingUser = await User.findOne({ email })
        if(existingUser) return res.status(400).json({ message: "User already exist" })

        if(password !== confirmPassword) return res.status(400).json({ message: "Password don't match" })
        
        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`})

        const token = jwt.sign({ email: result.email, id: result._id }, SECRET, { expiresIn: "1h" })
        
        res.status(200).json({ result, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong"}) 
    }
})



app.post('/user/signin', async (req, res)=> {
    const { email, password } = req.body //Coming from formData

    try {
        const existingUser = await User.findOne({ email })
        
        //get userprofile and append to login auth detail
        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })

        const isPasswordCorrect  = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"})

        //If crednetials are valid, create a token for the user
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET, { expiresIn: "1h" })
        
        //Then send the token to the client/frontend
        res.status(200).json({ result: existingUser, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong"})
    }
})








app.listen(5000,()=>{
    console.log('Server live on port 5000')
})
