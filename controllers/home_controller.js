module.exports.home = function(req,res){

    console.log(req.cookies);
    res.cookie('user_id', 25);
    res.cookie('something', 50);
    return res.render('home',{
        title: "Home"
    });
}