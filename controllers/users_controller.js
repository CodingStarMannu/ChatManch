const User = require('../models/user');

module.exports.profile = async function(req, res) {
  try {
    const user = await User.findById(req.params.id).exec();
    return res.render('user_profile', {
      title: "User Profile",
      profile_user: user
    });
  } catch (err) {
    console.log(err);
    // Handle the error here or pass it to the calling function using reject
  }
};

module.exports.update = async function(req, res) {
  try{
    if(req.user.id == req.params.id){

      const user = await User.findByIdAndUpdate(req.params.id, req.body,{
        new: true 
      });
      return res.redirect('back');
    }
    else{
      return res.status(401).send('Unauthorized');
    }
   
  }catch(err){
    console.log(err);
    return;
  }
}
// render the sign up page
module.exports.signUp = function(req, res){

    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title: "ChatManch | Sign Up"
    })
}

//render the sign in page
module.exports.signIn = function(req, res){

    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title: "ChatManch | Sign IN"
    })
}


//get the sign up data

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
  


//sign in and create a session for the user
module.exports.createSession = function(req,res){
    return res.redirect('/');
}

// sign out the user
module.exports.destroySession = function(req, res) {
  req.logout(function(err) {
    if (err) {
      console.log(err); // Handle the error appropriately
    }
    return res.redirect('back');
  });
};




// call back functions

// module.exports.create = function(req, res){
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