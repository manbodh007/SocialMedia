const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendReq_controller'); 
const friendListController = require('../controllers/friend_list');
router.post('/request',friendController.sendReq);
router.get('/request-list',friendController.requestList);
router.get('/request-accept/:id',friendController.accept);

router.get('/list',friendListController.friends);

router.post('/to-unfriend/:id',friendController.unfriend);


module.exports = router;