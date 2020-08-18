const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user:{
       type: mongoose.Schema.Types.ObjectId
    },
    // this define the object id of the liked object
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:'onModel'
    },
    // this field is used to define the type of the object since this is Dynamic reference
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
    
},{
    timestamps:true,
});

const Like = mongoose.model('Like',likeSchema);
module.exports = Like;