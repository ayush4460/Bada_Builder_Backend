const appDb = require('../data/AppDbContext');

class UnitService {
  async getUnitsByPropertyId(propertyId) {
    if (!propertyId) throw new Error('Property ID is required');
    
    // Find all units for this property
    return await appDb.units.findAll({ property_id: propertyId });
  }

  async createOrUpdateUnit(data) {
    // Check if unit exists via unit_identifier AND property_id
    // But unit_identifier logic might rely on unique constraint?
    // Let's rely on finding by identifier if we enforce uniqueness per property
    // For now, simpler: data provided should have updates
    
    // If id is provided, update
    if (data.id) {
       return await appDb.units.update(data.id, data);
    }
    
    // Logic for seeding/upsert could be complex. 
    // ThreeDView seeding logic sends lots of units.
    // Ideally we batch or handle one by one.
    // Since this is MVP, we assume create if no ID.
    return await appDb.units.create(data);
  }

  async seedUnits(units) {
     // Batch insert?
     // BaseRepository creates one by one usually.
     // Let's do parallel
     const promises = units.map(u => appDb.units.create(u));
     return await Promise.all(promises);
  }
}

module.exports = new UnitService();
