import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, store_name, source_type } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a truly unique random store_id
    // We'll use 4 bytes (8 hex characters)
    let store_id = crypto.randomBytes(4).toString('hex');
    
    // Check if by any miracle this ID already exists
    let storeExists = await User.findOne({ store_id });
    while (storeExists) {
      store_id = crypto.randomBytes(4).toString('hex');
      storeExists = await User.findOne({ store_id });
    }

    const user = await User.create({
      name,
      email,
      password,
      store_name,
      store_id,
      source_type,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        store_name: user.store_name,
        store_id: user.store_id,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        store_name: user.store_name,
        store_id: user.store_id,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message });
  }
};
