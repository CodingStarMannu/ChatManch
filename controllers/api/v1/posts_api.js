const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


module.exports.index = async function(req,res){

    const posts = await Post.find({}).sort("-createdAt")
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path:'user'
            }
        });
    return res.json(200,{
        message: "Lists of posts",
        posts:posts
    })
}



module.exports.destroy = async function(req,res){

    try{
        const post = await Post.findById(req.params.id);

        //.id means converting the object id into string
        // if(post.user == req.user.id){


            // await Like.deleteMany({likeable: post._id, onModel: 'Post'});
            // await Like.deleteMany({_id: {$in:post.comments}});


            post.deleteOne();

            // we are deleting all the comments of the post also
           await Comment.deleteMany({ post:req.params.id});



           return res.json(200,{
            message: "Post and associated comments deleted successfully!"
           })
        // }
        // else{
        //     req.flash("error","You cannot delete this post!");
        //     return res.redirect('back');
        // }

    }catch(err){
        
        return res.json(500,{
            message: "Internal Server Error"
        });
    }
}