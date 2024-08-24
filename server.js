require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();
const path = require('path');


const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT || 5000}`;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// ... rest of the server.js code remains the same


app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find().sort({ createdAt: 'desc' });
  res.render('index', { shortUrls: shortUrls, baseUrl: BASE_URL });
});


app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  await shortUrl.save();
  
  // Check if the full URL starts with http:// or https://
  if (!/^https?:\/\//i.test(shortUrl.full)) {
    shortUrl.full = 'http://' + shortUrl.full;
  }
  
  res.redirect(shortUrl.full);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
