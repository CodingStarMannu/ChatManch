const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const queue = require('../config/kue');
const userEmailWorker = require('../workers/user_email_worker');

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


module.exports.resetPassword = function(req, res){
  return res.render('reset_password',{
      title: 'ChatManch | Reset Password',
      access: false
  });
}

module.exports.resetPassMail = async function(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (!user.isTokenValid) {
        user.accessToken = crypto.randomBytes(30).toString('hex');
        user.isTokenValid = true;
        await user.save();
      }

      const job = await queue.create('user-emails', user).save();

      req.flash('success', 'Password reset link sent. Please check your email');
      return res.redirect('/');
    } else {
      req.flash('error', 'User not found. Try again!');
      return res.redirect('back');
    }
  } catch (err) {
    console.log('Error:', err);
    req.flash('error', 'An error occurred. Please reset password again!.');
    return res.redirect('back');
  }
};

module.exports.setPassword = async function(req, res) {
  try {
    const user = await User.findOne({ accessToken: req.params.accessToken });

    if (user && user.isTokenValid) {
      return res.render('reset_password', {
        title: 'ChatManch | Reset Password',
        access: true,
        accessToken: req.params.accessToken
      });
    } else {
      req.flash('error', 'Link expired');
      return res.redirect('/users/reset-password');
    }
  } catch (err) {
    console.log('Error:', err);
    req.flash('error', 'An error occurred. Please Set your Password again!.');
    return res.redirect('/users/reset-password');
  }
};


module.exports.updatePassword = async function(req, res) {
  try {
    const user = await User.findOne({ accessToken: req.params.accessToken });

    if (user && user.isTokenValid) {
      if (req.body.newPass === req.body.confirmPass) {
        user.password = req.body.newPass;
        user.isTokenValid = false;
        await user.save();
        req.flash('success', 'Password updated. Login now!');
        return res.redirect('/users/sign-in');
      } else {
        req.flash('error', "Passwords don't match");
        return res.redirect('back');
      }
    } else {
      req.flash('error', 'Link expired');
      return res.redirect('/users/reset-password');
    }
  } catch (err) {
    console.log('Error:', err);
    req.flash('error', 'An error occurred in updating password. Please try again later.');
    return res.redirect('/users/reset-password');
  }
};

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
          // for handling existing avatar
          if(user.avatar){

            let currAvatarPath =path.join(__dirname, '..' , user.avatar);
            
            if(fs.existsSync(currAvatarPath)){
              fs.unlinkSync(currAvatarPath);
            }

          }
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

