import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    resetToken:String,
    expireToken:Date,
    endDate:String,
})

const User = mongoose.model('User', userSchema)

export default User