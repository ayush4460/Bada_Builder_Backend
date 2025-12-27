const BaseRepository = require('./BaseRepository');
const Lead = require('../entities/Lead');

class LeadRepository extends BaseRepository {
  constructor() {
    super(Lead);
  }
}

module.exports = LeadRepository;
