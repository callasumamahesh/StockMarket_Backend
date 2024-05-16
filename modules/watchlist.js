const mongoose = require('mongoose')
const WatchList = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    stock:{


        type:Array,
        required:true
    }
})
const userschema = `user${localStorage.getItem}`
const user = mongoose.model('email',WatchList)
module.exports = email;