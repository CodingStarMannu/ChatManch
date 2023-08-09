const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');


module.exports.home = async function(req, res){

    try{
        //populate the user of each post
        // populate the likes of each post and comment

        const posts = await Post.find({}).sort("-createdAt")
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path:'user'
            },
            populate:{
                path:'likes'
            }
        }).populate('likes');

        const users = await User.find({});

        return res.render('home',{
            title:'ChatManch | Home',
            posts: posts,
            all_users: users
        });
    }catch(err){
        console.log("Error", err);
        return;
    }
}