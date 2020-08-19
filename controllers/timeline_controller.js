

const Post = require('../models/post');
const User = require('../models/user');
const Likes = require('../models/like');
const Comment = require('../models/comment');
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

            // select all the liked and unliked post to show in view
            for(let i=0;i<posts.length;i++){
                let liked = await Likes.findOne({
                   likeable:posts[i]._id,
                   onModel:'Post',
                   user:req.user.id
                });

                if(liked){
                  posts[i].liked = true;
                }else{
                  posts[i].liked = false;
                }
                posts[i].save();
            }
           // mark the liked comment
            let comments = await Comment.find({});

            for(let j=0;j<comments.length;j++){
                let likedComment = await Likes.findOne({
                    likeable:comments[j]._id,
                    onModel:'Comment',
                    user:req.user.id
                 });

                 if(likedComment){
                     comments[j].liked = true;
                 }else{
                     comments[j].liked = false;
                 }

                 comments[j].save();
            }

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