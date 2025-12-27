exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('subscriptions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: {
      type: 'varchar(255)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    plan_id: { type: 'varchar(100)', notNull: true },
    plan_name: { type: 'varchar(100)' },
    payment_id: { type: 'varchar(255)' },
    amount: { type: 'decimal(10, 2)' },
    currency: { type: 'varchar(10)', default: 'INR' },
    status: { type: 'varchar(50)', default: 'active' },
    starts_at: { type: 'timestamp' },
    expires_at: { type: 'timestamp' },
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
  pgm.dropTable('subscriptions');
};
