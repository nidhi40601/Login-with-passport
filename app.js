const express = require("express");
const app = express();
const db = require("./models");
const session = require('express-session');
const expressSession = require('cookie-session');
const passport = require("passport");
const routes = require("./routes/routes")
require("./config/passport");
require("dotenv/config");

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//Session
app.use(session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    resave: false
}))


//Passport authentication
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) => {
    console.log(req.session);
    console.log(req.user);
    next();
})

//Routes
app.use('/',routes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening on port ${port}`));