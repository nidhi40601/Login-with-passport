const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require('../models');
const path = require('path');

router.get('/', (req,res) => {
    res.sendFile('views/welcome.html', {root: path.join(__dirname, '..') });
});

router.get('/login', (req,res) => {
    res.sendFile('views/login.html', {root: path.join(__dirname, '..') });
});

router.post('/', 
    passport.authenticate('local', 
        {failureRedirect: '/login-failure', successRedirect: '/login-success'}
    )
);

router.get('/logout', async (req,res,next) => {
    console.log(req.user);
    await req.logout(err => {
        if (err) { return next(err) }
        delete req.user;
        res.sendFile('views/login.html', {root: path.join(__dirname, '..') });
    });
    console.log(req.user);
    console.log('logged out');
    
});

router.get('/login-success', (req,res) => {
    res.sendFile('views/login-success.html', {root: path.join(__dirname, '..') });
});

router.get('/login-failure', (req,res) => {
    res.sendFile('views/login-fail.html', {root: path.join(__dirname, '..') });
});



module.exports = router;