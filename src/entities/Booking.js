const BaseEntity = require('./BaseEntity');

class Booking extends BaseEntity {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.user_id = data.user_id;
    this.property_id = data.property_id;
    
    this.visit_date = data.visit_date;
    this.visit_time = data.visit_time;
    this.number_of_people = data.number_of_people;
    
    this.person1_name = data.person1_name;
    this.person2_name = data.person2_name;
    this.person3_name = data.person3_name;
    
    this.pickup_address = data.pickup_address;
    this.property_location = data.property_location;
    this.property_title = data.property_title;
    
    this.payment_method = data.payment_method;
    this.payment_status = data.payment_status;
    this.payment_amount = data.payment_amount;
    this.payment_currency = data.payment_currency;
    this.razorpay_payment_id = data.razorpay_payment_id;
    this.razorpay_order_id = data.razorpay_order_id;
    this.razorpay_signature = data.razorpay_signature;
    
    this.status = data.status || 'pending';
  }

  static get tableName() {
    return 'bookings';
  }

  static get columns() {
    return [
      'id', 'user_id', 'property_id',
      'visit_date', 'visit_time', 'number_of_people',
      'person1_name', 'person2_name', 'person3_name',
      'pickup_address', 'property_location', 'property_title',
      'payment_method', 'payment_status', 'payment_amount', 'payment_currency',
      'razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature',
      'status', 'created_at', 'updated_at'
    ];
  }
}

module.exports = Booking;
