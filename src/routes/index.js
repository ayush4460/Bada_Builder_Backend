const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const uploadRoutes = require('./uploadRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const propertiesRoutes = require('./propertiesRoutes');
const subscriptionsRoutes = require('./subscriptionsRoutes');
const bookingsRoutes = require('./bookingsRoutes');
const leadsRoutes = require('./leadsRoutes');
const unitsRoutes = require('./unitsRoutes');

router.use('/health', healthRoutes);
router.use('/upload', uploadRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/properties', propertiesRoutes);
// Mount units under properties/:propertyId/units
propertiesRoutes.use('/:propertyId/units', unitsRoutes);

router.use('/subscriptions', subscriptionsRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/leads', leadsRoutes);

module.exports = router;
