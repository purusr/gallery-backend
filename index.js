import express, { urlencoded } from "express";
import cors from 'cors'
import mongoose from "mongoose";
import Pics from "./models/Pics.js"


mongoose.connect('mongodb+srv://krish-node:Krishna8686@cluster0.emvic.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('Db connected successfully')})
.catch((error) => console.log('Db has connection error'))
const app = express();
app.use(express.json())
app.use(urlencoded(true))
app.use(cors())


app.get('/', (req, res)=>{
    res.send('Gallery server is doing good.');
})

app.get('/getGallery',async(req,res)=>{
       const images = await Pics.find()
       res.json(images)
})

app.post('/createGallery/', async(req, res)=>{
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

app.listen(5000,()=>{
    console.log('Server live on port 5000')
})