const unitService = require('../services/UnitService');
const appDb = require('../data/AppDbContext');

exports.getUnits = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const units = await unitService.getUnitsByPropertyId(propertyId);
    res.status(200).json({ success: true, units });
  } catch (error) {
    next(error);
  }
};

exports.seedUnits = async (req, res, next) => {
  try {
    const { units } = req.body;
    if (!Array.isArray(units)) throw new Error('Units must be an array');
    
    const results = await unitService.seedUnits(units);
    res.status(201).json({ success: true, count: results.length });
  } catch (error) {
    next(error);
  }
};

exports.updateUnit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const unit = await appDb.units.findOne({ id });
        if (!unit) return res.status(404).json({ success: false, message: 'Unit not found' });
        
        // Handle logic for booking/hold (server side validation?)
        // Assuming raw updates for now to match rapid prototype style
        
        const updated = await appDb.units.update(id, updates);
        res.status(200).json({ success: true, unit: updated });
    } catch (error) {
        next(error);
    }
};
