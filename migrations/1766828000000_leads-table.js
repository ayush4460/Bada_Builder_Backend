exports.up = (pgm) => {
  pgm.createTable('leads', {
    id: { type: 'uuid', default: pgm.func('gen_random_uuid()'), notNull: true, primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    requirement_type: { type: 'varchar(100)', notNull: true },
    budget: { type: 'varchar(100)', notNull: true },
    location: { type: 'varchar(255)', notNull: true },
    phone: { type: 'varchar(20)', notNull: true },
    bhk_type: { type: 'varchar(50)' },
    
    status: { type: 'varchar(50)', default: 'new' }, // new, contacted, closed
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });
  
  pgm.createIndex('leads', 'status');
};

exports.down = (pgm) => {
  pgm.dropTable('leads');
};
