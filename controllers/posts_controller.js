const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.create = async function(req,res){
 
    try{
        
        const post = await Post.create({
            content: req.body.content, 
            user: req.user._id
        });
        // console.log(req.user);
        return res.redirect('back');
    }catch(err){
        console.log('Error in creating a post:', err);
        return;
    }
}


module.exports.destroy = async function(req,res){

    try{
        const post = await Post.findById(req.params.id);

        //.id means converting the object id into string
        if(post.user == req.user.id){
            post.deleteOne();

            // we are deleting all the comments of the post also
           await Comment.deleteMany({ post:req.params.id});
           return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }

    }catch(err){
        console.log("Error in deleting the post", err);
    }
}