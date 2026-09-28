const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      index: true
    },
    fuelType: {
      type: String,
      enum: ['ev', 'gas', 'hybrid'],
      default: 'ev'
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    // EV Specific Metrics
    batteryLevelPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    chargeStatus: {
      type: String,
      enum: ['discharging', 'charging', 'idle'],
      default: null
    },
    // Gas / ICE Specific Metrics
    fuelLevelPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    engineStatus: {
      type: String,
      enum: ['running', 'off', 'idling'],
      default: null
    },
    // Shared Fleet Metrics
    estimatedRangeKm: {
      type: Number,
      required: true
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    speedKmh: {
      type: Number,
      default: 0
    },
    cargoTempCelsius: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Telemetry', telemetrySchema);