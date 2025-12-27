exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('audit_logs', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'varchar(255)' }, // Nullable if action is anonymous or system
    action: { type: 'varchar(255)', notNull: true },
    resource_type: { type: 'varchar(100)' },
    resource_id: { type: 'varchar(255)' },
    metadata: { type: 'jsonb', default: '{}' },
    ip_address: { type: 'varchar(45)' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('audit_logs');
};
