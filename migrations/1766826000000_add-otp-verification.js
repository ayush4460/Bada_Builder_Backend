exports.shorthands = undefined;

exports.up = pgm => {
  // Create email_verifications table
  pgm.createTable('email_verifications', {
    email: { type: 'varchar(255)', primaryKey: true },
    otp_hash: { type: 'varchar(255)', notNull: true },
    expires_at: { type: 'timestamp', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add columns to users table
  pgm.addColumns('users', {
    phone_number: { type: 'varchar(20)' },
    is_verified: { type: 'boolean', default: false },
  });
};

exports.down = pgm => {
  pgm.dropColumns('users', ['phone_number', 'is_verified']);
  pgm.dropTable('email_verifications');
};
