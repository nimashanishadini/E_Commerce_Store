const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// Route imports
const products = require('./routes/products');
const auth = require('./routes/auth');
const users = require('./routes/users');
const orders = require('./routes/orders');
const uploads = require('./routes/uploads');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/products', products);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/orders', orders);
app.use('/api/v1/uploads', uploads);

// Error handling middleware
app.use(errorHandler);

module.exports = app;