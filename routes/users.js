const express = require('express');
const router =  express.Router();


const usersController = require('../controllers/users_controller');

router.get('/profile', usersController.profile);

//routes for sign-up and sign-in
router.get('/sign-up', usersController.signUp);
router.get('/Sign-in', usersController.signIn);

router.post('/create', usersController.create);



module.exports = router;