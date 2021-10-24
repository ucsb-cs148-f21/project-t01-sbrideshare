const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: Number,
    full_name: String,  
    given_name: String, 
    family_name: String, 
    email: String, 
    drives: Array, 
    rides: Array,
    history: Array
})

module.exports = mongoose.model('Users', userSchema)
