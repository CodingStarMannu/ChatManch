const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');



module.exports.create = async function(req, res){
 
    try{
        let post =  await Post.findById(req.body.post);
            if(post){
                let comment = await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                });
                comment = await Comment.findById(comment._id);
                post.comments.push(comment);
                await post.save();

                console.log("working@@@@");

                comment = await  comment.populate('user','name email');

                console.log(comment);
                // commentsMailer.newComment(comment);
                
                let job = await queue.create('emails', comment).save(function(err){
                    if(err){
                        console.log('Error in creating a queue', err);
                        return;
                    }

                    console.log('job enqueued', job.id);
                })

                if(req.xhr){
                    //similar for comments to fetch user's id!


                    return res.status(200).json({
                        data:{
                            comment: comment 
                        },
                        message: 'Post Created'
                    });
                }
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