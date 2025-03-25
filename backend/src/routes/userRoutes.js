const express = require('express');
const { getUsers } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/users', verifyToken, getUsers);

module.exports = router;