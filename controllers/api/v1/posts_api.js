const Post = require('../../../models/post')
const Comment = require('../../../models/comment')

module.exports.index = async function(req,res){

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:({
                path:'user'
            })
        });

    return res.json(200,{
        message:'post of list',
        post:posts
    })
}

module.exports.distroy = async function(req,res){
  try{
        let post = await Post.findById(req.params.id)
      // .id means converting the id into string one
     
        if(post.user == req.user.id){
        post.remove();
       await Comment.deleteMany({post:req.params.id})
       
       return res.json(200,{
           message:'post and associated comment deleted successfully'
       });
    }else{
        res.json(401,{
            message:'you can not delete the post'
        })
    }

  }catch(error){
      console.log(error);
      return res.json(500,{
          message:'Internal server error'
      });
  }
        
}