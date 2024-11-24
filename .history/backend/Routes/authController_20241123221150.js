// // authController.js
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import User from '../Models/userSchema.js';
// const secret = process.env.JWT_SECRET;

// export const signup = async (req, res) => {
//   const { name, email, password, role } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     const newUser = await User.create({ name, email, password: hashedPassword, role });
//     res.status(201).json({ message: 'User created successfully', userId: newUser._id });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '1h' });
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };




import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/userSchema.js';
const secret = process.env.JWT_SECRET;

// Signup Controller
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields (name, email, password, role) are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // Send response
    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login Controller
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/userSchema.js';


export const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Ensure JWT_SECRET is defined
    if (!secret) {
      return res.status(500).json({ error: 'JWT_SECRET is not defined in the environment' });
    }

    // Normalize email (optional) and find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '1h' });

    // Send response with token
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

