const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser);
      console.log('Deleting existing test user...');
      await User.deleteOne({ email: 'test@example.com' });
      console.log('Existing test user deleted');
    }

    // Create a new test user
    const newUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    // Save the user (password will be hashed by the pre-save hook)
    await newUser.save();
    console.log('Test user created successfully:', {
      name: newUser.name,
      email: newUser.email,
      id: newUser._id
    });

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestUser();