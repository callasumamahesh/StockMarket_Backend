const mongoose = require('mongoose')
const Users = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
})

const StockUsers = mongoose.model('StockUsers',Users)
module.exports = StockUsers;