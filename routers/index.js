const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home_controller');
const postController = require('./posts');
const userController = require('./users');
router.get('/',homeController.home);
router.use('/users',userController);
router.use('/posts',postController);
router.use('/comments',require('./comments'));
router.use('/api',require('./api'));
router.get('/reset-password',homeController.resetPasswordEmail);
router.post('/reset-password-email',homeController.resetPassLink);
router.get('/submit-password',function(req,res){
    return res.render('submit_password',{
        token:req.query.token
    })
});

router.get('/email-confirmation/:id',homeController.email_verify);

router.use('/likes',require('./likes'));

router.post('/new-password/:token',homeController.resetPassword);

module.exports = router;