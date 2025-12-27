const BaseRepository = require('./BaseRepository');
const Property = require('../entities/Property');

class PropertyRepository extends BaseRepository {
  constructor() {
    super(Property);
  }

  // BaseRepository findAll handles basic filtering, but we can override or extend
  // for complex JSONB queries if needed later.
}

module.exports = PropertyRepository;
