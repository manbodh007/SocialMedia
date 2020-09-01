

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

            let isPostliked = [];
            let emojiUrl = [];

            let isCommentliked = new Array(posts.length);

            for(let i=0;i<posts.length;i++){
                let liked = await Likes.findOne({
                   likeable:posts[i]._id,
                   onModel:'Post',
                   user:req.user.id
                });

                if(liked){
                //   posts[i].liked = true;
                  isPostliked[i] = true;
                  emojiUrl[i] = liked.name + '.png';
                }else{
                //   posts[i].liked = false;
                  isPostliked[i] = false;
                }

                
                    for(let j=0;j<posts[i].comments.length;j++){
                        isCommentliked[i] = new Array(posts[i].comments.length);
                        let likedComment = await Likes.findOne({
                            likeable:posts[i].comments[j]._id,
                            onModel:'Comment',
                            user:req.user.id
                         });
                         if(likedComment){
                            //  comments[j].liked = true;
                            isCommentliked[i][j] = true;
                         }else{
                            //  comments[j].liked = false;
                            isCommentliked[i][j] = false;
                         }
                    }
                
            }
          

          let all_users = await User.find({});
         

        



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
        

        // let userChatrooms = await User.findById(req.user.id).populate({
        //     path:'chatrooms',
        //     populate:({
        //         path:'user1',
        //         path:'user2'
        //     })
        // });
         ///test

         let length = [];
         for(let i=0;i<posts.length;i++){
             length[i] = i;
         }
         console.log(length.length);

        return res.render('user_timeline', {
            title: 'Eroschat',
            posts: posts,
            all_users: all_users,
            currentUser: currentUser,
            friends: currentUser.friends,
            chatrooms:currentUser.chatrooms,
            is_post_liked:isPostliked,
            isCommentliked:isCommentliked,
            length:length,
            emojiUrl:emojiUrl,
        });

    }
    catch (error) {
        console.log('error:', error);
    }

}