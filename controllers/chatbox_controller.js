const Users = require('../models/user');

module.exports.activeChat = async function(req,res){
   try{
      let user = await Users.findById(req.params.id).populate('chatrooms');
       if(user&&req.xhr){
       return res.json(200,{
           chatroom:user.chatrooms
        }); 
      }else{
          console.log('error');
      }
      return res.require('back');
   }catch(err){
       console.log('error in fetching current chatrooms',err);
       return;
   }
}