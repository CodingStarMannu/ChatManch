const User = require('../models/user');

// render profile page after sign in
module.exports.profile = async function(req, res){
    try{
        if(req.cookies.user_id){
            const user = await User.findById(req.cookies.user_id);
            if(user){
                return res.render('user_profile',{
                    title: "User Profile",
                    user: user
                });
            }
        }
        return res.redirect('/users/sign-in');
    }catch(err){
        console.log("Error in showing profile", err);
        return res.redirect('/users/sign-in');
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up',{
        title: "ChatManch | Sign Up"
    })
}

//render the sign in page
module.exports.signIn = function(req, res){
    return res.render('user_sign_in',{
        title: "ChatManch | Sign IN"
    })
}


//get the sing up data
module.exports.create = async function(req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
        const createdUser = await User.create(req.body);
        return res.redirect('/users/sign-in');
        } else {
        return res.redirect('/users/sign-in');
        }
    } catch (err) {
        console.log("Error in signing up:", err);
        return res.redirect('back');
    }
};


//for sign in and create a session for the user

module.exports.createSession = async function(req, res) {
    try {
      // Find the user
    const user = await User.findOne({ email: req.body.email });
        if (!user) {
        // Handle user not found
        return res.redirect('back');
    }

      // Handle password mismatch
    if (user.password !== req.body.password) {
        return res.redirect('back');
    }

      // Handle session creation
    res.cookie('user_id', user.id);
    return res.redirect('/users/profile');
    } catch (err) {
        console.log('Error in signing in:', err);
        return res.redirect('back');
    }
}; 


module.exports.destroySession =  function(req,res){
    res.clearCookie('user_id');
    return res.redirect('/users/sign-in');
}







  //callback functions which are deprecated

  // for sign up
//   module.exports.create = function(req, res){
//     if(req.body.password != req.body.confirm_password){
//         return res.redirect('back');
//     }

//     User.findOne({email: req.body.email}, function(err, user){
//         if(err){
//             console.log("Error in finding user in signing up");
//             return;
//         }
//         //when user not found
//         if(!user){
//             User.create(req.body, function(err, user){
//                 if(err){
//                     console.log("Error in creating user while signing up");
//                     return res.redirect('/users/sign-in');
//                 }
//             })
//         }else{
//             return res.redirect('back');
//         }
//     });
// }

//for sign in and create a session for the user
// module.exports.createSession = function(req,res){
//    //steps to authenticate

//     // find the user
//  User.findOne({email: req.body.email}, function(err, user){
//     if(err){console.log('Error in finding user in signing in'); return}

    
//     //handle user found
//     if(user){

//     //handle password which don't match
//     if(user.password != req.body.password){
//         return res.redirect('back');
//     }

//     //handle session creation
//     res.cookie('user_id', user.id);
//     return res.redirect('/users/profile');

//     }else{
//         //handle user not found
//         return res.redirect('back');
//     }

//  })

// }