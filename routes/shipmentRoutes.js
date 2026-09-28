const express = require('express');
const router = express.Router();
const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentStatus,
  trackShipment
} = require('../controllers/shipmentController');
const { protect } = require('../middleware/authMiddleware');

// Public Route (No JWT required)
router.get('/track/:trackingNumber', trackShipment);

// Protected Routes
router.use(protect);
router.get('/', getShipments);
router.post('/', createShipment);
router.get('/:id', getShipmentById);
router.put('/:id/status', updateShipmentStatus);

module.exports = router;