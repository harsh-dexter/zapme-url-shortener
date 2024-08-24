const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
    default: () => nanoid(10),
    index:true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
