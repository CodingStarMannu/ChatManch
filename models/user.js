const mongoose =  require('mongoose');

const multer = require('multer');
const path = require('path');
// const AVATAR_PATH = path.join('uploads', 'users', 'avatars');
const AVATAR_PATH = path.join( '/uploads/users/avatars');

const userSchema  = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true 
    },
    accessToken:{
        type: String,
        default: "abcdef"
    },
    isTokenValid:{
        type: Boolean,
        default: false
    },
    avatar:{
        type: String
    },
    friendship:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friendship'
    }
    ]
}, {
    timestamps: true    // track the time duration of an operation.
});

let storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
     filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


//static function 
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User;






