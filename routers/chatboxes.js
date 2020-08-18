const express = require('express');
const router = express.Router()
const chatboxController = require('../controllers/chatbox_controller');
router.get('/active/:id',chatboxController.activeChat);

module.exports = router;