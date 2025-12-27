const pool = require('../config/db');

class BaseRepository {
  constructor(entity) {
    this.pool = pool.pool;
    this.entity = entity;
    this.tableName = entity.tableName;
  }

  async findAll(filters = {}, limit = 20, offset = 0) {
    const keys = Object.keys(filters);
    const params = Object.values(filters);
    
    let query = `SELECT * FROM ${this.tableName}`;
    
    if (keys.length > 0) {
      const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
      query += ` WHERE ${whereClause}`;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${keys.length + 1} OFFSET $${keys.length + 2}`;
    
    const result = await this.pool.query(query, [...params, limit, offset]);
    return result.rows.map(row => new this.entity(row));
  }

  async findOne(filters) {
    const keys = Object.keys(filters);
    const params = Object.values(filters);
    
    const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
    const query = `SELECT * FROM ${this.tableName} WHERE ${whereClause} LIMIT 1`;
    
    const result = await this.pool.query(query, params);
    if (result.rows.length === 0) return null;
    return new this.entity(result.rows[0]);
  }

  async create(data) {
    const columns = this.entity.columns.filter(col => data[col] !== undefined);
    const values = columns.map(col => data[col]);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.pool.query(query, values);
    return new this.entity(result.rows[0]);
  }

  async update(filters, data) {
    const filterKeys = Object.keys(filters);
    const filterValues = Object.values(filters);
    const whereClause = filterKeys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
    
    const dataKeys = Object.keys(data).filter(k => k !== 'id' && k !== 'uid' && k !== 'created_at');
    const dataValues = dataKeys.map(k => data[k]);
    const setClause = dataKeys.map((key, i) => `${key} = $${i + filterValues.length + 1}`).join(', ');
    
    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE ${whereClause}
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [...filterValues, ...dataValues]);
    return result.rows.length ? new this.entity(result.rows[0]) : null;
  }
}

module.exports = BaseRepository;
