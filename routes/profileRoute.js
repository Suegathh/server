const express = require('express');
const router = express.Router();
const { getProfile } = require('../controller/authController');

router.get('/profile', getProfile);

module.exports = router;
