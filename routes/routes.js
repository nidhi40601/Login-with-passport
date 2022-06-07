const express = require("express");
const router = express.Router();
const passport = require("passport");
const db = require('../models');
const path = require('path');
//const authenticator = require('otplib');
const GoogleAuthenticator = require("passport-2fa-totp").GoogeAuthenticator;
const JSAlert = require("js-alert");


router.get('/', (req,res) => {
    res.render('../views/register.ejs');
});


router.post('/register',passport.authenticate('local', 
            {successRedirect: '/setup-2fa', 
            failureRedirect:'/register' ,
            failureMessage:"Register Fail" })
);

router.get('/setup-2fa', (req,res) => {
    const qrInfo = GoogleAuthenticator.register(req.user.username);
    req.session.qr = qrInfo.secret;
    res.render('../views/register-2fa.ejs', { qr: qrInfo.qr });
})


router.post('/register-2fa', (req,res) => {
    if (!req.session.qr) {
        JSAlert.alert("Account cannot be registered");
        console.log("Account cannot be registered");
        return res.redirect('/setup-2fa');
    }

    db.users.findOne({
        where: {
            id: req.user.id
        }
    }).then(user => {
        if(!user){
            req.logout();
            return res.redirect('/');
        }

        db.users.update({
            secret: req.session.qr
        },{
            where: {
                id: user.id
            }
        }).then(data =>{
            console.log("Updated", data);
            res.redirect("/login");
        }, err => {
            console.log(err);
            return res.redirect('/setup-2fa');
        })
    },err => {
        console.log(err);
        return res.redirect('/setup-2fa');
    })
});


router.get('/login', (req, res) => {
    return res.render('../views/login.ejs')
});


router.post('/login', 
    passport.authenticate('2fa-totp', 
        {failureRedirect: '/login', failureMessage:"Invalid username and password", successRedirect: '/profile'}
    )
);

router.get('/profile', (req, res) => {
    return res.render("../views/profile.ejs", {user: req.user});
});

router.get('/logout', async (req,res,next) => {
    await req.logout(err => {
        if (err) { return next(err) }
        delete req.user;
        res.redirect('/');
    });
    console.log('logged out'); 
 });


module.exports = router;