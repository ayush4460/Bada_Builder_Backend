exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumn('users', {
    password_hash: { type: 'varchar(255)' },
  });
};

exports.down = pgm => {
  pgm.dropColumn('users', 'password_hash');
};
