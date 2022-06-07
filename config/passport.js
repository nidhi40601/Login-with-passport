const passport = require("passport");
const { use } = require("passport/lib");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");
const GoogleAuthenticator = require("passport-2fa-totp").GoogeAuthenticator;
const TwoFAStrategy = require("passport-2fa-totp").Strategy;

const firstStepVerifyUser = (username, password, cb) => {
    db.users.findOne({
        where: {
            username: username
        }
    }).then(user => {
        console.log(user);
        if(!user) { return cb(null, false) }
        
        if(user.password === password){
            console.log("same");
            cb(null, user);
        }else{
            console.log("not same");
            cb(null,false);
        }
    }, err => {
        console.log("some");
        cb(err);
    })
};

const secondStepVerifyUser = (user, cb) => {
    if (!user.secret) {
        cb(new Error("Google Authenticator is not setup yet."));
    } else {
        // Google Authenticator uses 30 seconds key period
        // https://github.com/google/google-authenticator/wiki/Key-Uri-Format
        
        var secret = GoogleAuthenticator.decodeSecret(user.secret);
        cb(null, secret, 30);
    } 
}

const registerVeryifyUser = (username,password,cb) => {
    db.users.create({
        username: username,
        password: password
    }).then(user => {
        if(!user) { return cb(null, false)}
        cb(null, user);
    }, err => {
        cb(err);
    })
}

const registerStrategy = new LocalStrategy(registerVeryifyUser);
const strategy = new TwoFAStrategy(firstStepVerifyUser, secondStepVerifyUser);

passport.use(registerStrategy);
passport.use(strategy);

passport.serializeUser(function(user, cd) {
    cd(null, user);
});

passport.deserializeUser(function(user, cd) {
    cd(null, user);
});