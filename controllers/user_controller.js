
const Users = require('../models/user');
const Chatrooms = require('../models/chatrooms');
const path = require('path');

module.exports.profile = async function(req,res){

        let user= await Users.findById(req.params.id);

        let currentUser = await Users.findById(req.user.id).populate('friends')
        .populate({
                path: 'request',
                populate: ({
                    path: 'user'
            })
        })
        
        return res.render('profile',{
            title:user.name + "profile",
            profile_user:user,
            currentUser:currentUser
        });
    
 
}
module.exports.userProfile = function(req,res){
    req.flash('success','not allowed');
    return res.redirect('back');
}


module.exports.update = async function(req,res){

    if(req.user.id==req.params.id){
       try{
         let user = await Users.findById(req.params.id);
          await Users.uploadedAvatar(req,res,function(err){
             if(err){
                 console.log('multer error',err);
             }
             user.name = req.body.name;
             user.email = req.body.email;
             if(req.file){
                 user.avatar = Users.avatarPath + '/' + req.file.filename;
             }
             user.save();
             return res.redirect('back');
         })
       }catch(error){
          req.flash('error',error);
          console.log('error',error);
          return res.redirect('back');
       }

    }
}



module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
     return res.redirect('/users/timeline');
    }
    return res.send('/','<h1>hello</h1>')
}
module.exports.signUp = function(req,res){
    
    if(req.isAuthenticated()){
      req.flash('error','cannot excess sign-up page');
      return res.redirect('/users/timeline');
    }
    return res.render('sign_up',{
        title:"sign Up"
    })
}
module.exports.create = async function(req,res){
    try{
        console.log(req.body);
        if(req.body.password!= req.body.conform_password)
        return res.redirect('back');

    let user = await Users.findOne({email:req.body.email});

        if(!user){
            let userdata = await Users.create(req.body);
            return res.redirect('/');
        }else{
            return res.redirect('/users/sign-up');
        }
    }catch(error){
        console.log("Error",error);
        return;
    }
    
}
module.exports.createSession = function(req,res){
    req.flash('success','you are logged in Successfully');
    return res.redirect('/users/timeline');
}


module.exports.distroySession = function(req,res){
    req.logout();
    req.flash('success','you are logged out Successfully');
    return res.redirect('/');
}

module.exports.connectWithChat = async function(req,res){
    try{

        let chatroom1 = await Chatrooms.findOne({
            user1:req.params.id,
            user2:req.user.id
        }).populate({
            path:'user1',
            populate:({
                path:'user'
            })
        });
        let chatroom2 = await Chatrooms.findOne({
            user2:req.params.id,
            user1:req.user.id
        }).populate({
            path:'user2',
            populate:({
                path:'user'
            })
        });

        // let chatroom_name = 'eroschat'+ parseInt(Math.random()*100) + parseInt(Math.random()*100);
          let chatroom;
          let user1;     // other user
          let user2;      // self

        if(chatroom1){
            chatroom = chatroom1;
            user1 = chatroom1.user1;
            user2 = chatroom1.user2;
        }else if(chatroom2){
            chatroom = chatroom2;
            user1 = chatroom2.user2;
            user2 = chatroom2.user1;
        }else{
            let chatRoom = await Chatrooms.create({
                user1:req.params.id,
                user2:req.user.id,
            });
            chatRoom = await chatRoom.execPopulate({
                path:'user1',
                populate:({
                    path:'user'
                })
            });
            chatroom = chatRoom;
            user1 = chatRoom.user1;
            user2 = chatRoom.user2;
        }
        // push chatroom into the user

        let user = await Users.findById(req.user.id);
        let existRoom = await Users.findOne({
            _id:req.user.id,
            chatrooms:chatroom._id
        });

        if(!existRoom){
             user.chatrooms.push(chatroom._id);
             user.save();
        }
        // return xhr request result
        
        
            if(req.xhr){
                return res.json(200,{
                    chatroom:chatroom,
                    user1:user1,
                    user2:user2
                })
            }
            return res.redirect('back');

        
    }catch(error){
        console.log('error while connecting chat with friend',error);
    }
    
}

