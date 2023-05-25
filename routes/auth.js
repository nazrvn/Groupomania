const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');


// USER
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// ADMIN
router.post('/save', authController.addUser);
router.post('/update/:id', authController.editUser);
router.delete('/delete/:id', authController.deleteUser);

module.exports = router;