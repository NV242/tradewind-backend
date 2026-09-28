const express = require('express');
const router = express.Router();
const {
  logTelemetry,
  getLatestFleetStatus,
  getVehicleHistory
} = require('../controllers/telemetryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('driver', 'admin', 'warehouse_staff'), logTelemetry);
router.get('/latest', authorize('admin', 'warehouse_staff'), getLatestFleetStatus);
router.get('/vehicle/:vehicleId', getVehicleHistory);

module.exports = router;