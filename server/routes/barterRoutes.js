const express = require('express');
const router = express.Router();
const barterController = require('../controllers/barterController');
const { protect } = require('../middleware/auth');

router.use(protect); // All barter operations require authentication

router.post('/', barterController.createBarterRequest);
router.get('/received', barterController.getReceivedBarterRequests);
router.get('/sent', barterController.getSentBarterRequests);
router.get('/:id', barterController.getBarterById);
router.patch('/:id/status', barterController.updateBarterStatus);
router.patch('/:id/cancel', barterController.cancelBarter);

module.exports = router;
