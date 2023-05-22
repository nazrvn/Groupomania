const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

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

    //console.log('User:', req.user);

    try {
        if(req.user){
            res.render('profile', {
                user: req.user
            });
        } else {
            res.redirect('/login');
        }
    } catch (error){
        console.log(error);
    }
    
 })

 module.exports = router;