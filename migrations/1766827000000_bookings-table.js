exports.up = (pgm) => {
  pgm.createTable('bookings', {
    id: { type: 'uuid', default: pgm.func('gen_random_uuid()'), notNull: true, primaryKey: true },
    user_id: { type: 'varchar(255)', notNull: true, references: '"users"(uid)', onDelete: 'CASCADE' },
    property_id: { type: 'uuid', notNull: false, references: '"properties"(id)', onDelete: 'SET NULL' },
    
    // Booking Details
    visit_date: { type: 'date', notNull: true },
    visit_time: { type: 'varchar(50)', notNull: true },
    number_of_people: { type: 'integer', notNull: true },
    
    // Visitor Names
    person1_name: { type: 'varchar(255)', notNull: true },
    person2_name: { type: 'varchar(255)' },
    person3_name: { type: 'varchar(255)' },
    
    // Location
    pickup_address: { type: 'text' },
    property_location: { type: 'text' }, // snapshot
    property_title: { type: 'varchar(255)' }, // snapshot
    
    // Payment
    payment_method: { type: 'varchar(50)' }, // 'previsit', 'postvisit'
    payment_status: { type: 'varchar(50)', default: 'pending' }, 
    payment_amount: { type: 'decimal' },
    payment_currency: { type: 'varchar(10)' },
    razorpay_payment_id: { type: 'varchar(255)' },
    razorpay_order_id: { type: 'varchar(255)' },
    razorpay_signature: { type: 'varchar(255)' },
    
    // Status
    status: { type: 'varchar(50)', default: 'pending' }, 
    
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });
  
  pgm.createIndex('bookings', 'user_id');
  pgm.createIndex('bookings', 'property_id');
};

exports.down = (pgm) => {
  pgm.dropTable('bookings');
};
