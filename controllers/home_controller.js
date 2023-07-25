const Post = require('../models/post');
const User = require('../models/user');

// module.exports.home = async function(req,res){

    // console.log(req.cookies);
    // res.cookie('user_id', 25);
    // res.cookie('something', 50);

// try{
//     const posts = await Post.find({});
//     return res.render('home',{
//         title: " ChatManch|Home",
//         posts: posts 
//     });
// }catch(err){
//   console.log(err);
//   return;
// }
// }


module.exports.home = async function(req, res){

    //populate the user of each post
    try{

        const posts = await Post.find({}).sort("-createdAt")
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path:'user'
            }
        })
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