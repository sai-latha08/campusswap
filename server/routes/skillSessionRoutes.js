const express = require('express');
const router = express.Router();
const skillSessionController = require('../controllers/skillSessionController');
const { protect } = require('../middleware/auth');

router.use(protect); // All session scheduling & management require login

router.post('/', skillSessionController.scheduleSession);
router.get('/', skillSessionController.getMySessions);
router.patch('/:id/status', skillSessionController.updateSessionStatus);

module.exports = router;
