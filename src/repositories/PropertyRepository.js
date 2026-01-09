const BaseRepository = require('./BaseRepository');
const Property = require('../entities/Property');

class PropertyRepository extends BaseRepository {
  constructor() {
    super(Property);
  }

  async findAll(filters = {}, limit = 20, offset = 0) {
    const keys = Object.keys(filters);
    const params = Object.values(filters);
    
    // Start building query
    let query = `
      SELECT p.*, u.user_type, u.name as owner_name, u.email as owner_email 
      FROM ${this.tableName} p
      LEFT JOIN users u ON p.user_id = u.uid
    `;
    
    if (keys.length > 0) {
      const whereClause = keys.map((key, i) => `p.${key} = $${i + 1}`).join(' AND ');
      query += ` WHERE ${whereClause}`;
    }
    
    query += ` ORDER BY p.created_at DESC LIMIT $${keys.length + 1} OFFSET $${keys.length + 2}`;
    
    const result = await this.pool.query(query, [...params, limit, offset]);
    
    // We can map to entity, but entity might not have user_type field defined. 
    // Ideally we extend the returned object.
    return result.rows.map(row => {
        const entity = new this.entity(row);
        entity.user_type = row.user_type; // Attach extra fields
        entity.owner_name = row.owner_name;
        return entity;
    });
  }
}

module.exports = PropertyRepository;
