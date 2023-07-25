const Post = require('../models/post');
const Comment = require('../models/comment');
// const Like = require('../models/like');



module.exports.create = async function(req,res){
 
    try{
        
        let post = await Post.create({
            content: req.body.content, 
            user: req.user._id
        });

        if(req.xhr){

            // post = await post.populate('user', 'name').execPopulate();
            post = await post.populate(['user']);
            // console.log("inside xhr", post);
            return res.status(200).json({
                data:{
                    post: post
                },
                message:"Post Created!"
            });
        }
    
        req.flash('success', 'Post Published By Controller!');
        return res.redirect('back');
    }catch(err){
        console.log('error in creating comment', err);
        req.flash("error", err);
        return res.redirect('back');
    }
}


module.exports.destroy = async function(req,res){

    try{
        const post = await Post.findById(req.params.id);

        //.id means converting the object id into string
        if(post.user == req.user.id){


            // await Like.deleteMany({likeable: post._id, onModel: 'Post'});
            // await Like.deleteMany({_id: {$in:post.comments}});


            post.deleteOne();

            // we are deleting all the comments of the post also
           await Comment.deleteMany({ post:req.params.id});

           if(req.xhr){
            return res.status(200).json({
                data:{
                    post_id: req.params.id
                },
                message: "Post Deleted!"
            });
            
           }
           req.flash('success', 'Post and associated comments deleted!');

           return res.redirect('back');
        }
        else{
            req.flash("error","You cannot delete this post!");
            return res.redirect('back');
        }

    }catch(err){
        req.flash("error", err);
        return res.redirect('back');
    }
}