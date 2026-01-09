const appDb = require('../data/AppDbContext');

const adminPropertiesController = {
    createProperty: async (req, res, next) => {
      try {
        const { title, type, location, price, description, status, image_url, facilities, developer_info } = req.body;
        
        // Admin created properties are marked as Bada Builder properties
        const propertyData = {
          user_id: req.user.uid, // Admin's ID
          title,
          type,
          location,
          price,
          description,
          status: status || 'active',
          image_url,
          facilities,
          developer_info, // Should include developer details if adding on behalf of someone
          is_bada_builder: true // Flag effectively set via model update or migration default
        };

        // Access properties repository from appDb
        const properties = appDb.properties;
        
        const newProperty = await properties.create(propertyData);
        
        // Enforce is_bada_builder = true (if create doesn't support it yet)
        await properties.update({ id: newProperty.id }, { is_bada_builder: true });
        
        res.status(201).json({ success: true, data: { ...newProperty, is_bada_builder: true } });
      } catch (error) {
        next(error);
      }
    },

    configureGroupBooking: async (req, res, next) => {
      try {
        const { id } = req.params;
        const config = req.body; // { totalSlots, minBuyers, discount, ... }
        
        // Validate config?
        if (!config.totalSlots || !config.endDate) {
           return res.status(400).json({ success: false, message: 'Total slots and End Date are required for group booking.' });
        }

        const data = {
          is_live_grouping: true,
          live_group_config: config
        };

        const properties = appDb.properties;
        const updatedProperty = await properties.update({ id }, data);
        
        if (!updatedProperty) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        res.status(200).json({ success: true, data: updatedProperty });
      } catch (error) {
        next(error);
      }
    }
};

module.exports = adminPropertiesController;
