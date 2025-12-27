const appDb = require('../data/AppDbContext');

class LeadService {
  async createLead(data) {
    // Basic validation
    if (!data.name || !data.phone) {
      throw new Error('Name and phone are required');
    }
    
    if (!data.status) data.status = 'new';
    
    const lead = await appDb.leads.create(data);
    return lead;
  }

  async getAllLeads(filters = {}) {
    return await appDb.leads.findAll(filters);
  }
}

module.exports = new LeadService();
