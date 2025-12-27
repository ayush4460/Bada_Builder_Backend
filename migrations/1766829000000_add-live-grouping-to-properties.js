exports.up = (pgm) => {
  pgm.addColumns('properties', {
    is_live_grouping: { type: 'boolean', default: false },
    is_bada_builder: { type: 'boolean', default: false }, // Also adding for RecommendedProjects filter
    live_group_config: { type: 'jsonb', default: '{}' }, // slots, prices, dates etc.
    // Example live_group_config:
    // {
    //   totalSlots: 20,
    //   filledSlots: 5,
    //   minBuyers: 10,
    //   discount: '15%',
    //   pricePerSqFt: 5000,
    //   groupPricePerSqFt: 4250,
    //   startDate: '...',
    //   endDate: '...',
    //   benefits: ['...']
    // }
  });
  
  pgm.createIndex('properties', 'is_live_grouping');
};

exports.down = (pgm) => {
  pgm.dropColumns('properties', ['is_live_grouping', 'is_bada_builder', 'live_group_config']);
};
