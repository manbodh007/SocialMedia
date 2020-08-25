const express = require('express');
const router = express.Router()
const messageConroller = require('../controllers/messages_controller');
router.post('/save',messageConroller.saved);
router.get('/with-users',messageConroller.activeMessages)

module.exports = router;