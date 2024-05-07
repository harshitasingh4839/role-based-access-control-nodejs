const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const connectFlash = require('connect-flash');
const passport= require('passport');
const { ensureLoggedIn } = require('connect-ensure-login');
// To save the session 
const MongoStore = require('connect-mongo');
const { roles } = require('./utils/constants');

const app = express();
const PORT = process.env.PORT || 5050

// To set the view engine to ejs
app.set('view engine','ejs');

// To get the log statement for request routes
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));


// Init session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    store: MongoStore.create({
        mongoUrl: `${process.env.MONGO_URI}${process.env.DB_NAME}`, // Change this URL to match your MongoDB connection string and database name
        ttl: 7 * 24 * 60 * 60, // Session TTL (optional, in seconds)
        autoRemove: 'interval', // Automatically remove expired sessions (optional)
        autoRemoveInterval: 10, // Interval to check for and remove expired sessions (optional, in minutes)
    }),
    cookie: {
        httpOnly: true,
        // maxAge: 1000 * 60 * 60 * 24 * 7
    },
}));


// For passport Js Authentication 
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.auth');

app.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
})

// Init flash messages
app.use(connectFlash());
app.use((req,res,next) => {
    res.locals.messages = req.flash();
    next();
})


app.use('/',require('./routes/index.route'));
app.use('/auth',require('./routes/auth.route'));
app.use('/user',
ensureLoggedIn({ redirectTo: '/auth/login' }),
require('./routes/user.route'));
app.use('/admin',
ensureLoggedIn({ redirectTo: '/auth/login' }),
ensureAdmin,
require('./routes/admin.route'));


app.use(express.static(path.join(__dirname,'public')));
// app.use(express.urlencoded({extended: false}));


app.use((req,res,next)=>{
    next(createHttpError.NotFound());
});

app.use((error,req,res,next)=>{
    error.status = error.status || 500;
    res.status(error.status);
    res.render('error_40x',{error})
});


async function connectToMongoDB() {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}${process.env.DB_NAME}`);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server listening to https://localhost:${PORT}`)
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
connectToMongoDB();


function ensureAdmin(req,res,next){
    if (req.user.role === roles.admin){
        next();
    }
    else{
        // next(createHttpError.Forbidden());
        req.flash('warning','you are not Authorized to see this route');
        res.redirect('/');
    }
}

function ensureModerator(req,res,next){
    if (req.user.role === roles.moderator){
        next();
    }
    else{
        // next(createHttpError.Forbidden());
        req.flash('warning','you are not Authorized to see this route');
        res.redirect('/');
    }

}