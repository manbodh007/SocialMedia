

const Post = require('../models/post');
const User = require('../models/user');
const { populate } = require('../models/user');

module.exports.home = async function (req, res) {

    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: ({
                    path: 'user'
                })
            });

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
        ;

        // let userChatrooms = await User.findById(req.user.id).populate({
        //     path:'chatrooms',
        //     populate:({
        //         path:'user1',
        //         path:'user2'
        //     })
        // });

        return res.render('user_timeline', {
            title: 'Eroschat',
            posts: posts,
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