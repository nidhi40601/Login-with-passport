const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");

const verifyUser = (username, password, cb) => {
    db.users.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if(!user) { return cb(null, false) }

        if(user.password === password){
            cb(null, user);
        }else{
            cb(null,false);
        }
    }, err => {
        cb(err);
    })
};

const strategy = new LocalStrategy(verifyUser);

passport.use(strategy);

passport.serializeUser(function(user, cd) {
    cd(null, user);
});

passport.deserializeUser(function(user, cd) {
    cd(null, user);
});