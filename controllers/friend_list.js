const User = require('../models/user');
const Friend = require('../models/friend');
module.exports.allUsers = async function(req,res){
    try {

        let users = await User.find({});
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

        let isFriend = [];
        for(let i=0;i<users.length;i++){

            let friend = await Friend.findOne({
                 user1:req.user.id,
                 user2:users[i]._id
            });
            if(!friend){
                friend = await Friend.findOne({
                    user2:req.user.id,
                    user1:users[i]._id
               });
            }

            if(friend){
                isFriend[i] = true;
            }else{
                isFriend[i] = false;
            }
        }



        

        return res.render('all_users', {
            title: 'Eroschat',
            all_users: users,  
            currentUser: currentUser,
            friends: currentUser.friends,
            chatrooms:currentUser.chatrooms,
            is_friend:isFriend,
        });

    }
    catch (error) {
        console.log('error:', error);
    }

}

module.exports.friends = async function(req,res){
    try{
    let users = await User.find({});
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

    let isFriend = [];
    for(let i=0;i<users.length;i++){
        let friend = await User.findOne({
             friends:users[i]._id,
        });

        if(friend){
            isFriend[i] = true;
        }else{
            isFriend = false;
        }
    }
    return res.render('users_friends', {
        title: 'Eroschat',
        all_users: users,  
        currentUser: currentUser,
        friends: currentUser.friends,
        chatrooms:currentUser.chatrooms
    });

}
  catch (error) {
    console.log('error:', error);
   }
}