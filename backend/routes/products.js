const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', adminAuth, upload.array('images', 5), createProduct);
router.put('/:id', adminAuth, upload.array('images', 5), updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;