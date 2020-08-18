const User = require('../models/user');

module.exports.sendReq = async function(req,res){
  try{
    let user =  await User.findById(req.query.id);

    let existReq = await User.findOne({
      _id:req.query.id,
      request:req.user._id
    });
    let status;

    if(existReq){
          user.request.pull(req.user._id);
          user.save();
          status = 'Follow'
      }else{
        user.request.push(req.user._id);
        user.save();
        status = 'cancel'
      }
         
    

    if(req.xhr){
        return res.json(200,{
           status:status,
           message:'success'
        })
    }
    return res.redirect('back');

  }catch(error){
       console.log(error);
       return;
  }
}

module.exports.requestList = async function(req,res){
  try{
     let user = await User.findById(req.user._id).populate({
       path:'request',
       populate:{
         path:'user'
       }
     });

    return res.render('friendReq_list',{
      user:user,
      currentUser:user
    });
  }catch(error){
    console.log('error',error);
  }
}


module.exports.accept = async function(req,res){
  try{
  let user = await User.findById(req.user._id);
  let friend = await User.findById(req.params.id);
  
  let status;
  if(user&&friend){
      await user.friends.push(req.params.id);
      await user.request.pull(req.params.id);
      user.save();
      await friend.friends.push(req.user._id);
      friend.save();
      
  }else{
    console.log('user or requested friend not found');
    retrurn;
  }

  if(req.xhr){
    return res.json(200,{
      message:'friend requested accepted'
    })
  }
   return res.redirect('back');
   }catch(error){
    console.log('error',error);
  }
}