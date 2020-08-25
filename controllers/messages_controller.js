
const User = require('../models/user');
const Chatrooms = require('../models/chatrooms');

module.exports.saved = async function(req,res){
    try{
        console.log('data',req.query.id);

        let chatroom = await Chatrooms.findById(req.query.id);
        if(chatroom){
            chatroom.messages.push({
              message:req.query.message,
              sender:req.query.email,
              username:req.query.username,
              time:req.query.time,
            })
            chatroom.save();
            console.log(chatroom);
            
          

            if(req.xhr){
                return res.json(200,{
                    message:'message store in db'
                })
            }
        }else{
            console.log('chatroom not found;')
        }

        if(req.xhr){
            return res.json(200,{
                message:'message  not store in db'
            })
        }

        return res.redirect('back');

    }catch(err){
        console.log('error in saving messages',err);
        return;
    }
}

module.exports.activeMessages = async function(req,res){
    try{
        let user = await User.findById(req.user.id).populate({
            path:'chatrooms',
            populate:({
                  path:'user1',
            }),
        }).populate({
        path:'chatrooms',
            populate:({
                  path:'user2',
            }),
      });

        let currentUser = await User.findById(req.user.id).populate('friends')
        .populate({
                path: 'request',
                populate: ({
                    path: 'user'
            })
        })
        .populate({
            path:'chatrooms',
            populate:({
                path:'user1',
                populate:({
                    path:'user'
                }),
            })
        });

      return res.render('all_chats',{
          chatrooms:user.chatrooms,
          currentUser: currentUser,
      });
 
    }catch(error){
        console.log('error',error);
        return;
    }
}
