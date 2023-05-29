const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index', {
        user: req.user
    });
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/profile', authController.isLoggedIn, (req, res) => {
    try {
      if (req.user) {
        if (req.user.role === 'admin') {
          res.render('admin', {
            user: req.user
          });
        } else {
          res.render('profile', {
            user: req.user
          });
        }
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      console.log(error);
    }
})

router.get('/dashboard', authController.isLoggedIn, authController.getUser, (req, res) => {
    try {
      if (req.user.role === 'admin') {
        res.render('dashboard');
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      console.log(error);
    }
})

module.exports = router;