const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.toggleLike = async (req, res) =>{
    try {

        // likes/toggle/?id=abcd&type=Post
        let likeable;
        let deleted = false;

        if (req.query.type == 'Post') {
            console.log('inside post like')
            likeable = await Post.findById(req.query.id).populate('likes');
        }else {
            console.log("inside comment like");
            likeable = await Comment.findById(req.query.id).populate('likes');
        }


        // check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        // if a like already exists then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.deleteOne();
            deleted = true;

        }else {
            // else make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();

        }

        return res.status(200).json({
            data:{
                deleted: deleted 
            },
            message: 'Request Successful'
        });
        // the below code will give deprecated warning
        // return res.json(200, {
        //     message: 'Request successful!',
        //     data: {
        //         deleted: deleted
        //     }
        // })
    } catch (err) {
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}