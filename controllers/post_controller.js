const Post = require("../models/post");
const Comment = require("../models/comment");
const Likes = require('../models/like');

module.exports.create = async function (req, res) {
  try {
    Post.uploadedPostImg(req,res,async function(error){
      if (error) {
        console.log("multer post inm error", error);
        return;
      }
      console.log("file",req.file);

      let post = await Post.create({
        content: req.body.content,
        user: req.user._id,
      }); 

        if(req.file) {
          console.log(req.file);
          if(req.file.mimetype=='video/mp4')
          post.video = Post.videoPath + "/" + req.file.filename;
          else
          post.image = Post.imagePath + "/" + req.file.filename;
          
          post.save();
        }

        if (req.xhr) {
          post = await post.populate('user').execPopulate();
          return res.json(200,{
            data:{
              post:post,
            },
            message:'post created'
          })
        }

    });

    

    return res.redirect("back");
  } catch (error) {
    console.log("error", error);
  }
};

module.exports.distroy = async function (req, res) {
  let post = await Post.findById(req.params.id);
  // .id means converting the id into string one
  if (post.user == req.user.id) {
    post.remove();

    await Comment.deleteMany({ post: req.params.id });
    await Likes.deleteMany({likeable:req.params.id});

    if (req.xhr) {
      return res.status(200).json({
        data: {
          post_id: req.params.id,
        },
        message: "post deleted",
      });
    }
    req.flash("success", "Post and associated comments deleted!");
    return res.redirect("back");
  } else {
    req.flash("error", "You cannot delete this post!");
    return res.redirect("back");
  }
};
