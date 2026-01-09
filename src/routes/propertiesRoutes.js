const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/propertiesController');
const auth = require('../middleware/auth');

router.post('/', auth, propertiesController.createProperty);
router.get('/', propertiesController.getProperties);
router.get('/user/me', auth, propertiesController.getMyProperties);
router.get('/:id', propertiesController.getPropertyById);
router.put('/:id', auth, propertiesController.updateProperty);

module.exports = router;
