const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const uploadRoutes = require('./uploadRoutes');
const authRoutes = require('./authRoutes');
const propertiesRoutes = require('./propertiesRoutes');
const subscriptionsRoutes = require('./subscriptionsRoutes');

router.use('/health', healthRoutes);
router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);
router.use('/properties', propertiesRoutes);
router.use('/subscriptions', subscriptionsRoutes);

module.exports = router;
