const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    full_name: String,  
    given_name: String, 
    family_name: String, 
    email: String, 
    id: Number,
    drives: Array, 
    rides: Array,
    history: Array
})

module.exports = mongoose.model('Users', userSchema)
