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
app.listen(5000,()=>{
    console.log('Server live on port 5000')
})