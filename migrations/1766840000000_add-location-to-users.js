/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns('users', {
    location: { type: 'text' },
  });
};

exports.down = pgm => {
  pgm.dropColumns('users', ['location']);
};
