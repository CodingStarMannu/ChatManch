const Post = require('../models/post');

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


module.exports.home = function(req, res){

    Post.find({}).then (function(posts){
        return res.render('home',{
            title: "ChatManch | Home",
            posts: posts 
        });
        }).catch((err)=>{
            console.log(err);
        });
    
}