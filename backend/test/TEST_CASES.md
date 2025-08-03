# Model Validation Test Cases

| Model | Field Tested | Input (Actual) | Expected Error Field |
|-------|--------------|----------------|---------------------|
| User | name missing | `{ email, password }` | name |
| User | valid data | `{ name, email, password }` | none |
| Hotel | name missing | `{ location, address, phone, email, hotelierId }` | name |
| Hotel | valid data | `{ name, location, address, phone, email, hotelierId }` | none |
| Room | name missing | `{ type, price, capacity, totalRooms, hotelId }` | name |
| Room | valid data | `{ name, type, price, capacity, totalRooms, hotelId }` | none |
| Booking | bookingId missing | `{ checkIn, checkOut, guests, nights, roomType, subtotal, tax, total, paymentMethod, userId, hotelId, roomId }` | bookingId |
| Booking | valid data | `{ bookingId, checkIn, checkOut, guests, nights, roomType, subtotal, tax, total, paymentMethod, userId, hotelId, roomId }` | none |
| Review | rating missing | `{ comment, userId, hotelId, bookingId }` | rating |
| Review | valid data | `{ rating, comment, userId, hotelId, bookingId }` | none |
| Payment | amount missing | `{ adminCommission, hotelerAmount, paymentMethod, bookingId, userId, hotelierId }` | amount |
| Payment | valid data | `{ amount, adminCommission, hotelerAmount, paymentMethod, bookingId, userId, hotelierId }` | none |
| Notification | title missing | `{ message, type, userId }` | title |
| Notification | valid data | `{ title, message, type, userId }` | none |recycle


# Model Validation Test Cases

| Model | Field Tested | Input (Actual) | Expected Error Field |
|-------|--------------|----------------|---------------------|
| User | name missing | { email, password } | name |
| User | valid data | { name, email, password } | none |
| Hotel | name missing | { location, address, phone, email, hotelierId } | name |
| Hotel | valid data | { name, location, address, phone, email, hotelierId } | none |
| Room | name missing | { type, price, capacity, totalRooms, hotelId } | name |
| Room | valid data | { name, type, price, capacity, totalRooms, hotelId } | none |
| Booking | bookingId missing | { checkIn, checkOut, guests, nights, roomType, subtotal, tax, total, paymentMethod, userId, hotelId, roomId } | bookingId |
| Booking | valid data | { bookingId, checkIn, checkOut, guests, nights, roomType, subtotal, tax, total, paymentMethod, userId, hotelId, roomId } | none |
| Review | rating missing | { comment, userId, hotelId, bookingId } | rating |
| Review | valid data | { rating, comment, userId, hotelId, bookingId } | none |
| Payment | amount missing | { adminCommission, hotelerAmount, paymentMethod, bookingId, userId, hotelierId } | amount |
| Payment | valid data | { amount, adminCommission, hotelerAmount, paymentMethod, bookingId, userId, hotelierId } | none |
| Notification | title missing | { message, type, userId } | title |
| Notification | valid data | { title, message, type, userId } | none |