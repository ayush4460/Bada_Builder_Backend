exports.up = (pgm) => {
  pgm.createTable('units', {
    id: { type: 'uuid', default: pgm.func('gen_random_uuid()'), notNull: true, primaryKey: true },
    property_id: { type: 'uuid', notNull: true, references: '"properties"', onDelete: 'CASCADE' },
    
    // Logical identifiers from 3D view (e.g. Tower_1_Floor_5_Unit_A)
    unit_identifier: { type: 'varchar(100)', notNull: true }, 
    
    tower_id: { type: 'integer', notNull: true },
    floor_id: { type: 'integer', notNull: true },
    unit_number: { type: 'varchar(20)', notNull: true }, // "5A"
    unit_type: { type: 'varchar(50)' }, // "3 BHK"
    
    carpet_area: { type: 'integer' },
    super_built_up_area: { type: 'integer' },
    price: { type: 'numeric(12, 2)' },
    
    status: { type: 'varchar(20)', default: 'available' }, // available, booked, hold
    
    booked_by: { type: 'varchar(255)', references: '"users"' },
    booked_by_name: { type: 'varchar(255)' }, // Snapshot
    booked_at: { type: 'timestamp' },
    
    held_by: { type: 'varchar(255)', references: '"users"' },
    held_by_name: { type: 'varchar(255)' },
    held_at: { type: 'timestamp' },
    
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });
  
  pgm.createIndex('units', ['property_id', 'status']);
  pgm.createIndex('units', 'unit_identifier', { unique: true }); // Ensure unique identifier per system/property? Maybe unique per property.
  // Actually unit_identifier is composed of tower/floor/unit so it's unique IF property is implicit, but here let's make it unique combined with property_id if we wanted, 
  // but "Tower_1..." string might be generic if multiple properties use same template.
  // Better to just index it.
};

exports.down = (pgm) => {
  pgm.dropTable('units');
};
