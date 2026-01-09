const BaseEntity = require('./BaseEntity');

class Property extends BaseEntity {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.user_id = data.user_id;
    this.title = data.title;
    this.type = data.type;
    this.location = data.location;
    this.price = data.price;
    this.description = data.description;
    this.status = data.status || 'active';
    this.image_url = data.image_url;
    this.facilities = data.facilities; // JSONB
    this.developer_info = data.developer_info; // JSONB
    this.is_live_grouping = data.is_live_grouping || false;
    this.is_bada_builder = data.is_bada_builder || false;
    this.live_group_config = data.live_group_config || {};
  }

  static get tableName() {
    return 'properties';
  }

  static get columns() {
    return [
      'id', 'user_id', 'title', 'type', 'location', 'price', 'description',
      'status', 'image_url', 'facilities', 'developer_info', 
      'is_live_grouping', 'is_bada_builder', 'live_group_config',
      'created_at', 'updated_at'
    ];
  }
}

module.exports = Property;
