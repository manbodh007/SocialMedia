const User = require('../models/user');
const Friend = require('../models/friend');

module.exports.sendReq = async function(req,res){
  try{
    let receiver =  await User.findById(req.query.id);
    
    let isFriend = await Friend.findOne({
       user1:req.user.id,
       user2:req.query.id
    });
    
    if(!isFriend){
      isFriend = await Friend.findOne({
        user2:req.user.id,
        user1:req.query.id
      });
    }

    let message;

    if(isFriend){
      status = 'Follow'
      message = 'you are already friend';
    }

    let existReq = await User.findOne({
        _id:req.query.id,
        request:req.user._id,
    });


    let status;

    if(existReq){
          receiver.request.pull(req.user._id);
          receiver.save();
          status = 'Follow'
          message = 'request cancelled';
      }else{
        receiver.request.push(req.user._id);
        receiver.save();
        message = 'request sent successfully';
        status = 'cancel'
      }
         
    

    if(req.xhr){
        return res.json(200,{
           status:status,
           message:message
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

      await Friend.create({
        user1:req.user.id,
        user2:req.params.id
      });

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

module.exports.reject = function(req,res){
  
}

module.exports.unfriend = async function(req,res){
  let user = await User.findById(req.user.id);
  let friend = await User.findById(req.params.id);
  if(user&&friend){
    console.log('unfriend');
    user.friends.pull(friend._id);
    user.save();
    friend.friends.pull(user._id);
    friend.save();
    await Friend.deleteOne({
      user1:req.user.id,
      user2:req.params.id,
    });

    await Friend.deleteOne({
      user2:req.user.id,
      user1:req.params.id,
    });

    if(req.xhr){
      return res.json(200,{
        message:'unfriend one friend'
      })
    }
    
  }

  return res.redirect('/');
}