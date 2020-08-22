const Post = require('../models/post');

const Comment = require('../models/comment');
const commentMailer = require('../mailers/comment_mail');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function(req,res){
    try{
       let post = await Post.findById(req.body.post);
        if(post){
           let comment = await Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post
              });
                post.comments.push(comment);

                post.save();

               comment = await comment.populate('user').execPopulate();
             //commentMailer.newComment(comment);
            //   let job = queue.create('emails',comment).save(function(err){
            //    if(err){
            //      console.log('error in creating queue',err);
            //      return;
            //    }
            //    console.log('job enqueue',job.id);
            //  })
             
           
        if(req.xhr){
            return res.status(200).json({
                data:{
                    comment:comment
                },
                message:'comment created'
            })
       }
       req.flash('success','new comment is posted');
       return res.redirect('/');
    }
  }catch(error){
    req.flash('error',error);
    return;
  }
}
module.exports.distroy = async function(req,res){
    
   try{
    let comment = await Comment.findById(req.params.id);
    let postId = comment.post;
    let newpost = await Post.findById(postId);
            let userId = newpost.user;
           
             if(comment.user == req.user.id||userId==req.user.id){
                comment.remove();
                //delete the comment from the post
                await Post.findByIdAndUpdate(postId,{ $pull:{comments:req.params.id}});
                  
                if(req.xhr){
                  return res.json(200,{
                    data:{
                      comment_id:req.params.id,
                     },
                     message:'comment deleted'
                  });
                }
                req.flash('success','comment deleted');
            }
            return res.redirect('back');
        
   }catch(err){
       console.log("error in delete comment",err);
       req.flash('error','comment is not deleted');
       return res.redirect('back');
   }
        
    
}