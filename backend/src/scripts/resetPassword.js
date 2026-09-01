import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.js';
import User from '../models/User.js';

const resetPassword = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    let admin = await User.findOne({ email: 'admin@vishwakarmatemple.org' });
    if (!admin) {
      admin = new User({
        name: 'पण्डित रमेश आचार्य (Head Priest & Admin)',
        email: 'admin@vishwakarmatemple.org',
        password: 'TempleAdmin@2030',
        role: 'superadmin',
        phone: '+977 9852012345'
      });
      await admin.save();
      console.log('Created admin with new password TempleAdmin@2030');
    } else {
      admin.password = 'TempleAdmin@2030';
      await admin.save();
      console.log('Updated existing admin password to TempleAdmin@2030');
    }

    const testUser = await User.findOne({ email: 'admin@vishwakarmatemple.org' }).select('+password');
    const isMatch = await testUser.matchPassword('TempleAdmin@2030');
    console.log('Verification check: Password match is:', isMatch);

    process.exit(0);
  } catch (err) {
    console.error('Error resetting password:', err);
    process.exit(1);
  }
};

resetPassword();
