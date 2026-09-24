const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

router.get('/', itemController.getItems);
router.get('/my-items', protect, itemController.getMyItems);
router.get('/:id', itemController.getItemById);
router.post('/', protect, itemController.createItem);
router.put('/:id', protect, itemController.updateItem);
router.delete('/:id', protect, itemController.deleteItem);

module.exports = router;
