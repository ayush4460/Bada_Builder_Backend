const propertyService = require('../services/PropertyService');
const appDb = require('../data/AppDbContext'); // Still need context for AuditLogs if not moved to service. 
// Ideally Logic should be in service. The user asked for "call those methods in controller code whever required".
// Let's assume Audit creation is part of Create Property business logic.
// I'll move Audit Log creation into PropertyService later or keep it here if simplistic.
// Actually, PropertyService.createProperty calls appDb.properties.create.
// The user request was specific: "keep all context queries in a repostiroes and call those methods in controller code whever required"
// AND "create services folder... and call in controller".

exports.createProperty = async (req, res, next) => {
  try {
    // Pass role (individual/developer) to service to enforce data structure
    const newProperty = await propertyService.createProperty({ ...req.body, role: req.body.role }, req.user.uid);
    
    // Audit Log could be in Service, but keeping it explicit here is also fine for now.
    // Ideally, the Service should handle side-effects like Auditing.
    // I entered AuditLog logic in the previous turn into the controller.
    // Let's act pure: The Service returns the Created Property.
    // We can add Audit Log call here or in Service.
    // I'll add a helper in Service? No, AuditLogService?
    // Let's just use appDb.auditLogs here for now as it's a cross-cutting concern, or rely on PropertyService.
    
    // BETTER: Move audit logging to PropertService to encapsulate "Create Property" completely.
    // But I haven't added audit logging to PropertyService.js yet.
    // I will stick to basic service call + direct Audit Log call for now to match the previous logic exactly,
    // just swapping the data access.
    
    await appDb.auditLogs.log({
      user_id: req.user.uid,
      action: 'create_property',
      resource_type: 'property',
      resource_id: newProperty.id,
      metadata: JSON.stringify({ title: newProperty.title })
    });

    res.status(201).json({ success: true, property: newProperty });
  } catch (error) {
    next(error);
  }
};

exports.getProperties = async (req, res, next) => {
  try {
    const { user_id, type, role } = req.query;
    const filters = {};
    if (user_id) filters.user_id = user_id;
    if (type) filters.type = type;
    if (role) filters.role = role;
    filters.status = 'active';

    const properties = await propertyService.getAllProperties(filters);
    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (error) {
    next(error);
  }
};

exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({ success: true, property });
  } catch (error) {
    next(error);
  }
};

exports.updateProperty = async (req, res, next) => {
    // TODO: Implement update logic ensuring user ownership with appDb.properties.update
    res.status(501).json({ message: 'Not implemented yet' });
};

exports.getMyProperties = async (req, res, next) => {
  try {
    console.log('🔍 getMyProperties called for user:', req.user?.uid);
    const filters = { user_id: req.user.uid };
    // Optionally filters.status? The user wants 'their' properties, maybe inactive too?
    // Let's return all their properties for now.
    
    // Using propertyService.getAllProperties which relies on repository.findAll
    // NOTE: repository.findAll might default to filtering logic that we need to be careful with.
    // It filters by passing exact matches.
    
    const properties = await propertyService.getAllProperties(filters);
    console.log(`✅ Found ${properties.length} properties for user ${req.user?.uid}`);
    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (error) {
    console.error('❌ Error in getMyProperties:', error);
    next(error);
  }
};
