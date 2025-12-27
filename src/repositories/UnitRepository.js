const BaseRepository = require('./BaseRepository');
const Unit = require('../entities/Unit');

class UnitRepository extends BaseRepository {
  constructor() {
    super(Unit);
  }
}

module.exports = UnitRepository;
