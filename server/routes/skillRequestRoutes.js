const express = require('express');
const router = express.Router();
const skillRequestController = require('../controllers/skillRequestController');
const { protect } = require('../middleware/auth');

router.use(protect); // All skill request operations require login

router.post('/', skillRequestController.createRequest);
router.get('/received', skillRequestController.getReceivedRequests);
router.get('/sent', skillRequestController.getSentRequests);
router.patch('/:id/status', skillRequestController.updateRequestStatus);
router.patch('/:id/cancel', skillRequestController.cancelRequest);

module.exports = router;
