// backend/scripts/promote-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User.model');
const Mechanic = require('../src/models/Mechanic.model');

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email: node scripts/promote-admin.js user@example.com');
  process.exit(1);
}

const promote = async () => {
  try {
    // In backend directory, dotenv looks for .env automatically
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    let user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.log('User not found. Creating new ADMIN user...');
      user = await User.create({
        name: 'Master Admin',
        email: email.toLowerCase(),
        password: 'Admin@123', // Default password
        role: 'admin',
        isActive: true
      });
    }

    // If they also have a mechanic profile, approve it
    await Mechanic.findOneAndUpdate(
      { user: user._id },
      { isApproved: true }
    );

    console.log(`✅ Success! ${email} is now an ADMIN and has been approved.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

promote();
