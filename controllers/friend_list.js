const User = require('../models/user');
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
        

       

        return res.render('all_users', {
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