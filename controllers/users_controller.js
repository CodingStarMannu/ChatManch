const User = require('../models/user');

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
    req.flash("error", err);
    return res.redirect('back');
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




