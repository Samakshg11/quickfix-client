// scripts/promote-admin.js
require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const User = require('../backend/src/models/User.model');
const Mechanic = require('../backend/src/models/Mechanic.model');

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email: node scripts/promote-admin.js user@example.com');
  process.exit(1);
}

const promote = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.error('User not found!');
      process.exit(1);
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
