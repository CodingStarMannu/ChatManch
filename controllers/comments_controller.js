const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){
 
    try{
        let post =  await Post.findById(req.body.post);
            if(post){
                let comment = await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                });
                post.comments.push(comment);
                post.save();
                req.flash('success', 'Comment added!');
                res.redirect('/');
            }
    }
    catch(err){
        req.flash("error", err);
        return res.redirect('back');
    }
}


module.exports.destroy = async function(req,res){

    try{
        const comment = await Comment.findById(req.params.id);

        //.id means converting the object id into string
        if(comment.user == req.user.id){
            let  postId = comment.post;
            comment.deleteOne();

           await Post.findByIdAndUpdate(postId,{ $pull:{ post:req.params.id }});
           req.flash('error', 'Comment Deleted!');
           return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }

    }catch(err){
        req.flash("error", "Error in deleting Comments!");
        return res.redirect('back');
    }
}