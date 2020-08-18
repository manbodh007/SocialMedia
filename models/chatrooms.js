const mongoose = require('mongoose');
const { model } = require('../config/mongoose');

const chatRoomsSchema = new mongoose.Schema({
    user1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    user2 :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    messages:[{
        type:Object
    }]

})

const Chatrooms = mongoose.model('Chatroom',chatRoomsSchema);
module.exports = Chatrooms;