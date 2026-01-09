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
      const whereClauses = [];
      let paramIndex = 1;

      // Handle specific filters manually
      if (filters.role) {
        if (filters.role === 'individual') {
          whereClauses.push(`p.developer_info IS NULL`);
        } else if (filters.role === 'developer') {
          whereClauses.push(`p.developer_info IS NOT NULL`);
        }
        // Remove role from generic processing
        delete filters.role; 
      }

      // Handle remaining generic filters
      Object.keys(filters).forEach((key) => {
         // Prevent SQL injection by ensuring key is safe? 
         // Assuming internal usage or safe keys for now.
         whereClauses.push(`p.${key} = $${paramIndex}`);
         paramIndex++;
      });
      
      if (whereClauses.length > 0) {
          query += ` WHERE ${whereClauses.join(' AND ')}`;
      }
    }
    
    // Re-map params because we might have skipped 'role'
    // Actually, we need to rebuild params array to match the order of generic filters
    const finalParams = Object.values(filters); // 'role' was deleted from filters object
    
    query += ` ORDER BY p.created_at DESC LIMIT $${finalParams.length + 1} OFFSET $${finalParams.length + 2}`;
    
    const result = await this.pool.query(query, [...finalParams, limit, offset]);
    
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
