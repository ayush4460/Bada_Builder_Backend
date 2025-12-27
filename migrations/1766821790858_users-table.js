exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    uid: { type: 'varchar(255)', primaryKey: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    name: { type: 'varchar(255)' },
    user_type: { type: 'varchar(50)', default: 'individual' },
    is_subscribed: { type: 'boolean', default: false },
    subscription_expiry: { type: 'timestamp' },
    property_credits: { type: 'integer', default: 0 },
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
  pgm.dropTable('users');
};
