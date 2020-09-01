const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports.toggleLikes =  async function(req,res){
    try{
          let likeable;
          let liked = false;
        

          if(req.query.type =='Post'){
              likeable = await Post.findById(req.query.id).populate('likes');
          }else{
              likeable = await Comment.findById(req.query.id).populate('likes');
          }

          // check if like is already exists
          let existingLike = await Like.findOne({
              likeable:req.query.id,
              onModel:req.query.type,
              user:req.user._id
          })

          // if post or comment is already liked
          if(existingLike){
              likeable.likes.pull(existingLike._id);
              likeable.save();
              existingLike.remove();
              liked = true;

          }else{
              // else make a new like
             
              let newLike = await Like.create({
                  user:req.user._id,
                  likeable:req.query.id,
                  onModel:req.query.type,
                  name:req.query.name,
              })
              likeable.likes.push(newLike._id);
              likeable.save();
          }

          return res.json(200,{
              message:'request successful',
              data:{
                  liked:liked,
                  likeable:req.query.type
              }
          })


    }catch(error){
        if(error){
            return res.json(500,{
                message:'internal server Error'
            })
        }
    }
}