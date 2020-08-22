const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
    user1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    user2 :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

})

const Friends = mongoose.model('Friend',friendsSchema);
module.exports = Friends;