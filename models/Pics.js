import mongoose from "mongoose";


const PicsSchema = mongoose.Schema({
    image_url: String,
    likes: Number,
    comments: Array,
})

const Pics = mongoose.model('Pics', PicsSchema)

export default Pics;