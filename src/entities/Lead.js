const BaseEntity = require('./BaseEntity');

class Lead extends BaseEntity {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.name = data.name;
    this.requirement_type = data.requirement_type;
    this.budget = data.budget;
    this.location = data.location;
    this.phone = data.phone;
    this.bhk_type = data.bhk_type;
    this.status = data.status || 'new';
  }

  static get tableName() {
    return 'leads';
  }

  static get columns() {
    return [
      'id', 'name', 'requirement_type', 'budget', 'location', 'phone', 'bhk_type', 'status', 'created_at', 'updated_at'
    ];
  }
}

module.exports = Lead;
