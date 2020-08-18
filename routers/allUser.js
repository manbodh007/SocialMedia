const express = require('express');
const router = express.Router();
const allUserController = require('../controllers/friend_list');
router.get('/friend-list',allUserController.allUsers);

module.exports = router;