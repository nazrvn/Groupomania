const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');


// USER
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// ADMIN
router.post('/save', authController.AddUser);

module.exports = router;