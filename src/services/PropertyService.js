const appDbContext = require('../data/AppDbContext');

class PropertyService {
  constructor() {
    this.context = appDbContext;
  }

  async createProperty(data, userId) {
    const {
      title, type, location, price, description, image_url, facilities, role,
      // Developer specific fields to be stored in developer_info
      scheme_type, residential_options, commercial_options, base_price, max_price,
      project_location, amenities, owner_name, company_name, possession_status,
      rera_status, rera_number, project_name, project_stats, contact_phone,
      completion_date, project_images, brochure_url, expiry_date,
    } = data;

    let developerInfo = null;
    
    // Only populate developer info if role is NOT 'individual'
    // If explicit role is 'developer', or implicit structure suggests it and no role forced 'individual'
    if (role !== 'individual') {
      developerInfo = {
        scheme_type, residential_options, commercial_options, base_price, max_price,
        project_location, amenities, owner_name, company_name, possession_status,
        rera_status, rera_number, project_name, project_stats, contact_phone,
        completion_date, project_images, brochure_url, expiry_date
      };
      
      // Remove undefined values
      Object.keys(developerInfo).forEach(key => developerInfo[key] === undefined && delete developerInfo[key]);
      
      // If object ends up empty, make it null to be safe? Or keep strict?
      // Let's keep it null if empty to clean up DB
      if (Object.keys(developerInfo).length === 0) developerInfo = null;
    }



    const propertyData = {
      user_id: userId,
      title: title || project_name,
      type: type || scheme_type,
      location: location || project_location,
      price: price || (base_price && max_price ? `${base_price} - ${max_price}` : ''),
      description,
      image_url: image_url || (project_images && project_images[0]),
      facilities: JSON.stringify(facilities || []),
      developer_info: developerInfo ? JSON.stringify(developerInfo) : null
    };

    return await this.context.properties.create(propertyData);
  }

  async getAllProperties(filters = {}) {
    // Just delegating for now, but service is place for complex filtering logic mixing multiple repos if needed
    return await this.context.properties.findAll(filters);
  }

  async getPropertyById(id) {
    return await this.context.properties.findById(id); // BaseRepository findOne? No, we didn't implement findById in BaseRepository yet, wait.
    // BaseRepository has findOne(filters). 
    // We should probably add findById to BaseRepository or just use findOne({id}).
    // Let's check BaseRepository again. It has findOne(filters).
    // So context.properties.findOne({id}) should work.
    // But PropertyRepository extends BaseRepository.
    // Check PropertyRepository.js... it is empty.
    // So we use findOne({id}).
    // Wait, BaseRepository methods: findAll, findOne, create, update.
    // So here:
    return await this.context.properties.findOne({ id });
  }
}

module.exports = new PropertyService();
