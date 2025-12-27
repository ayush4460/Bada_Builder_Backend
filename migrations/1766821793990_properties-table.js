exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createExtension('pgcrypto', { ifNotExists: true });
  pgm.createTable('properties', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: {
      type: 'varchar(255)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    title: { type: 'varchar(255)' },
    type: { type: 'varchar(100)' },
    location: { type: 'varchar(255)' },
    price: { type: 'varchar(100)' }, 
    description: { type: 'text' },
    image_url: { type: 'text' },
    facilities: { type: 'jsonb', default: '[]' },
    developer_info: { type: 'jsonb', default: '{}' },
    status: { type: 'varchar(50)', default: 'active' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('properties');
  // pgm.dropExtension('pgcrypto'); // Usually better to leave extensions
};
