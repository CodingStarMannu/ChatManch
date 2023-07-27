const User = require('../models/user');
// const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req, res) {
  try {
    const user = await User.findById(req.params.id).exec();
    return res.render('user_profile', {
      title: "User Profile",
      profile_user: user
    });
  } catch (err) {
    req.flash("error", err);
    return res.redirect('back');
  }
};

// module.exports.update = async function(req, res) {
  
  // try{
    // if(req.user.id == req.params.id){

    //   const user = await User.findByIdAndUpdate(req.params.id, req.body,{
    //     new: true 
    //   });
    //   return res.redirect('back');
    // }
    // else{
    //   return res.status(401).send('Unauthorized');
    // }

//   if(req.user.id == req.params.id){

//   try{

//     let user = await User.findById(req.params.id);
//     User.uploadedAvatar(req, res, function(err){
//       if(err){
//         console.log('*********Multer Error',err);
//       }

//       user.name = req.body.name;
//       user.email = req.body.email;

//       if(req.file){
        // if(user.avatar){
        //   let currAvatarPath = path.join(__dirname,'..', user.avatar);
        //   if(fs.existsSync(currAvatarPath)){
        //     fs.unlinkSync(currAvatarPath);
        //   }
        // }
    // this is for saving the path of the uploaded file into the avatar field in the user
//       user.avatar = User.avatarPath + '//' + req.file.filename;
//       }
//       user.save();
//       return res.redirect('back');
//     });
//   }
//   catch(err){
//     req.flash("error", err);
//     return res.redirect('back');
//   }
// }else{
//   req.flash('error', 'Unauthorized');
//   return res.status(401).send('Unauthorized');
// }

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log('*********Multer Error', err);
          // Handle the error appropriately, e.g., show an error message to the user.
          return res.redirect('back');
        }
        //  console.log(req.file);
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          // Use path.join to join the path segments with the correct separator
          user.avatar = path.join(User.avatarPath, req.file.filename);
        }

        user.save();
        return res.redirect('back');
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect('back');
    }
  } else {
    req.flash('error', 'Unauthorized');
    return res.status(401).send('Unauthorized');
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
  req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

// sign out the user
module.exports.destroySession = function(req, res) {
  
  req.logout(function(err) {
    if (err) {
      console.log(err); 
      return next(err);// Handle the error appropriately
    }
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
  });
};

