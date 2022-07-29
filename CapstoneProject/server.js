// 542283440521-2sgfetvher2nu6fullk22a4ish600hgs.apps.googleusercontent.com
// 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

const express = require('express');
const mongoose  = require('mongoose');
const ejs = require('ejs')
const expresslayouts = require('express-ejs-layouts')
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const flash = require('express-flash');
const cookieParser = require('cookie-parser');


const morgan = require('morgan');


const app = express();
require('./app/config/databaseConnect');






app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: process.env.MY_COOKIE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 9900000
    }

}));

app.use(flash());

app.use((req, res, next) => {

    if (!req.session.shoppingCart) {
        req.session.shoppingCart = {
            cartitems: {},
            totalcost: 0,
            totalitems: 0
        }

    }
    
    res.locals.current = req.session;
    res.locals.user = req.session.user;
    // console.log(res.locals.current);
        next();
})
app.use(flash());


//Assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expresslayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');








require('./routes/websiteRoutes')(app);




app.listen(3002, () => {
    console.log('Server running on porrtt 3002');
});