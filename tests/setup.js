// tests/setup.js
const mongoose = require('mongoose');

beforeAll(async () => {
  // Connect to test DB
  await mongoose.connect(process.env.TEST_DB_URI);
});

afterAll(async () => {
  // Clean up
  await mongoose.connection.close();
});
