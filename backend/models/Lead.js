import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  store_id: {
    type: String,
    required: true,
    index: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    default: 'Unknown',
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  items: [
    {
      title: String,
      quantity: Number,
      price: Number,
      url: String, // Product URL
    }
  ],
  recovery_url: {
    type: String, // Abandoned Checkout recovery URL
  },
  amount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['started', 'abandoned', 'failed', 'success'],
    default: 'started',
  },
  source: {
    type: String,
    enum: ['shopify', 'gokwik'],
    required: true,
  },
  external_id: {
    type: String,
    unique: true,
    sparse: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  raw_data: {
    type: Object,
  },
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
