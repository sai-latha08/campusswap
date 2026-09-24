const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect); // All messaging requires login

router.get('/conversations', messageController.getConversations);
router.get('/:partnerId', messageController.getMessagesWithPartner);
router.post('/', messageController.sendMessage);
router.patch('/read/:partnerId', messageController.markAsRead);

module.exports = router;
