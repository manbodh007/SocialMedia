const chatRooms = require('../models/chatrooms');

module.exports.saved = async function(req,res){
    try{
        console.log('data',req.query.id);

        let chatroom = await chatRooms.findById(req.query.id);
        
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
