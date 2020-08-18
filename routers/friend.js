const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendReq_controller'); 
router.post('/request',friendController.sendReq);
router.get('/request-list',friendController.requestList);
router.get('/request-accept/:id',friendController.accept);


module.exports = router;