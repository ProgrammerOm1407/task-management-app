require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

async function testDB() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Create a test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    // Check if user already exists
    let user = await User.findOne({ email: testUser.email });
    
    if (user) {
      console.log('User already exists:', user.name, user.email);
    } else {
      // Create new user
      user = new User({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password
      });

      // Save user to database
      await user.save();
      console.log('User created successfully:', user.name, user.email);
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDB();