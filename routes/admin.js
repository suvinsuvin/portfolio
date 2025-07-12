const express = require('express');
const router = express.Router();
const auth = require('../admin/auth');
const { getMessages } = require('../controllers/adminController');

router.get('/messages', auth, getMessages);

module.exports = router;