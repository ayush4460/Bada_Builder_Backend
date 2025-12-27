const BaseEntity = require('./BaseEntity');

class Unit extends BaseEntity {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.property_id = data.property_id;
    this.unit_identifier = data.unit_identifier;
    this.tower_id = data.tower_id;
    this.floor_id = data.floor_id;
    this.unit_number = data.unit_number;
    this.unit_type = data.unit_type;
    this.carpet_area = data.carpet_area;
    this.super_built_up_area = data.super_built_up_area;
    this.price = data.price;
    this.status = data.status || 'available';
    this.booked_by = data.booked_by;
    this.booked_by_name = data.booked_by_name;
    this.booked_at = data.booked_at;
    this.held_by = data.held_by;
    this.held_by_name = data.held_by_name;
    this.held_at = data.held_at;
  }

  static get tableName() {
    return 'units';
  }

  static get columns() {
    return [
      'id', 'property_id', 'unit_identifier', 'tower_id', 'floor_id', 'unit_number',
      'unit_type', 'carpet_area', 'super_built_up_area', 'price', 'status',
      'booked_by', 'booked_by_name', 'booked_at',
      'held_by', 'held_by_name', 'held_at',
      'created_at', 'updated_at'
    ];
  }
}

module.exports = Unit;
