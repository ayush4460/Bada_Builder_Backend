exports.up = (pgm) => {
  pgm.addColumns('users', {
    profile_photo: { type: 'text' },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['profile_photo']);
};
