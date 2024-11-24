

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/userSchema.js';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;  

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields (name, email, password, role) are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, secret, { expiresIn: '1d' });

    // Send response with token
    res.status(201).json({ message: 'User created successfully', userId: newUser._id, token });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Login Controller
// import jwt from 'jsonwebtoken';
// import User from '../Models/userSchema.js';


export const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {

    // Normalize email and find user by email
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
    const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '1d' });

    // Send response with token
    res.json({ userId: user._id, token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

