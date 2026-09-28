const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    origin: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      enum: ['air', 'ocean', 'ground_ev', 'express'],
      required: true
    },
    weightKg: {
      type: Number,
      required: true
    },
    declaredValueUSD: {
      type: Number,
      required: true
    },
    // TradeWind Shield Insurance (1.5% coverage)
    hasShieldInsurance: {
      type: Boolean,
      default: false
    },
    shieldFeeUSD: {
      type: Number,
      default: 0
    },
    // Commercial B2B Customs Brokerage
    customsCleared: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'customs_hold', 'delivered', 'returned'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Shipment', shipmentSchema);