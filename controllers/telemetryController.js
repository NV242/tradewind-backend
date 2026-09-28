const Telemetry = require('../models/Telemetry');

// @desc    Log new telemetry ping from any fleet vehicle (EV or Gas)
// @route   POST /api/telemetry
// @access  Private (Drivers, Admins, or IoT Vehicle Gateway)
exports.logTelemetry = async (req, res) => {
  try {
    const {
      vehicleId,
      fuelType,
      batteryLevelPercent,
      chargeStatus,
      fuelLevelPercent,
      engineStatus,
      estimatedRangeKm,
      location,
      speedKmh,
      cargoTempCelsius
    } = req.body;

    const ping = await Telemetry.create({
      vehicleId,
      fuelType: fuelType || 'ev',
      driver: req.user ? req.user._id : null,
      batteryLevelPercent,
      chargeStatus,
      fuelLevelPercent,
      engineStatus,
      estimatedRangeKm,
      location,
      speedKmh,
      cargoTempCelsius
    });

    res.status(201).json(ping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get latest status for all active fleet vehicles
// @route   GET /api/telemetry/latest
// @access  Private (Warehouse Staff, Fleet Managers, Admins)
exports.getLatestFleetStatus = async (req, res) => {
  try {
    const fleetStatus = await Telemetry.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$vehicleId',
          latestPingId: { $first: '$_id' },
          fuelType: { $first: '$fuelType' },
          batteryLevelPercent: { $first: '$batteryLevelPercent' },
          chargeStatus: { $first: '$chargeStatus' },
          fuelLevelPercent: { $first: '$fuelLevelPercent' },
          engineStatus: { $first: '$engineStatus' },
          estimatedRangeKm: { $first: '$estimatedRangeKm' },
          location: { $first: '$location' },
          speedKmh: { $first: '$speedKmh' },
          cargoTempCelsius: { $first: '$cargoTempCelsius' },
          lastUpdated: { $first: '$createdAt' }
        }
      }
    ]);

    res.status(200).json(fleetStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get location and vehicle history for a specific van
// @route   GET /api/telemetry/vehicle/:vehicleId
// @access  Private
exports.getVehicleHistory = async (req, res) => {
  try {
    const history = await Telemetry.find({
      vehicleId: req.params.vehicleId
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};