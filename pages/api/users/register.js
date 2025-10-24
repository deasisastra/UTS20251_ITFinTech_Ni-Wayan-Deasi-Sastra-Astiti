import User from "../../../models/User";
import dbConnect from "../../../util/dbConnect";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Registration attempt started...');

  try {
    console.log('Connecting to database...');
    await dbConnect();
    
    const { fullName, phoneNumber, password, confirmPassword } = req.body;
    console.log('Registration data received:', { fullName, phoneNumber });

    // Validate required fields
    if (!fullName || !phoneNumber || !password || !confirmPassword) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'All fields are required',
        missing: {
          fullName: !fullName,
          phoneNumber: !phoneNumber,
          password: !password,
          confirmPassword: !confirmPassword
        }
      });
    }

    // Check if user exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      console.log('User already exists with phone:', phoneNumber);
      return res.status(400).json({ message: 'This phone number is already registered' });
    }

    // Validate password match
    if (password !== confirmPassword) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    console.log('Creating new user...');
    // Create new user
    const user = new User({
      fullName,
      phoneNumber,
      password,
      confirmPassword,
      phoneVerified: true
    });

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user.password = hash;
    user.confirmPassword = hash;

      // Save user
      await user.save();

      // Return success
      return res.status(200).json({
        success: true,
        message: 'Registration successful',
        user: {
          fullName: user.fullName,
          phoneNumber: user.phoneNumber
        }
      });

  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      if (err.keyPattern.fullName) {
        return res.status(400).json({ 
          message: 'Registration failed: This name is already registered. Please try a different name.',
          field: 'fullName'
        });
      }
      if (err.keyPattern.phoneNumber) {
        return res.status(400).json({ 
          message: 'Registration failed: This phone number is already registered',
          field: 'phoneNumber'
        });
      }
    }
    
    return res.status(500).json({ 
      message: 'Registration failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export default handler;