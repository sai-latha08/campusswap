const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/health
 * Returns the API status and MongoDB connection state.
 * Used by the frontend to verify connectivity.
 */
router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  sendSuccess(res, 200, 'CampusSwap API is running', {
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      name: mongoose.connection.name || 'campusswap',
    },
    version: '1.0.0',
  });
});

module.exports = router;
