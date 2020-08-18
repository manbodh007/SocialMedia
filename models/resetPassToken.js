const mongoose = require('mongoose');

const resetPassToken = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    accessToken:{
        type:String,
        required:true,
    },
    isValid :{
        type:Boolean,
        required:true,
    }
})

const Token = mongoose.model('resetPassToken',resetPassToken);
module.exports = Token;