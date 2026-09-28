const Shipment = require('../models/Shipment');

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private
const createShipment = async (req, res) => {
  try {
    const { origin, destination, mode, weightKg, declaredValueUSD, hasShieldInsurance } = req.body;

    const shieldFeeUSD = hasShieldInsurance ? Number((declaredValueUSD * 0.015).toFixed(2)) : 0;
    const trackingNumber = `TW-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const shipment = await Shipment.create({
      sender: req.user._id, // Updated from 'user' to 'sender'
      trackingNumber,
      origin,
      destination,
      mode,
      weightKg,
      declaredValueUSD,
      hasShieldInsurance,
      shieldFeeUSD,
      status: 'pending' // Updated to lowercase 'pending'
    });

    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all shipments for user (or all if admin/warehouse)
// @route   GET /api/shipments
// @access  Private
const getShipments = async (req, res) => {
  try {
    const filter = ['admin', 'warehouse_staff'].includes(req.user.role)
      ? {}
      : { sender: req.user._id }; // Updated from 'user' to 'sender'

    const shipments = await Shipment.find(filter).sort({ createdAt: -1 });
    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get single shipment by ID
// @route   GET /api/shipments/:id
// @access  Private
const getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update shipment status
// @route   PUT /api/shipments/:id/status
// @access  Private (Admin / Warehouse Staff)
const updateShipmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after' } // <--- Updated line
    );
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track shipment publicly by tracking number
// @route   GET /api/shipments/track/:trackingNumber
// @access  Public
const trackShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      trackingNumber: req.params.trackingNumber.trim().toUpperCase()
    });

    if (!shipment) {
      return res.status(404).json({ message: 'No shipment found with that tracking number.' });
    }

    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EXPORT ALL FUNCTIONS HERE AT THE BOTTOM
module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentStatus,
  trackShipment
};