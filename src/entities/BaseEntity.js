class BaseEntity {
  constructor(data) {
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }
}

module.exports = BaseEntity;
