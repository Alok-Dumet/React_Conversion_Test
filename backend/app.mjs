import './config.mjs';
import './db.mjs';
import './passportConfig.mjs';
import passport from 'passport';
import mongoose from 'mongoose';
import session from 'express-session';
import {router as authRouter, isAuthenticated} from './routes/logRegisterAuth.mjs'
import {router as profileRouter} from './routes/profileRouter.mjs'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

//Accessing my mongoose models
const User = mongoose.model('User');
const Campaign = mongoose.model('Campaign');
const CampaignElement = mongoose.model('CampaignElement');


//creating my express app
const app = express();


//getting file path to app.js
const __filename = fileURLToPath(import.meta.url);


//getting directory app.js is in
const __dirname = path.dirname(__filename);


//telling Express to use handlebars as the view engine to render templates and to look for them in my views folder
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


//telling Express to use my public folder to find my static files
app.use(express.static(path.join(__dirname, 'public')));


//allowing me to use req.body to read query string data as key-value pairs.
//In simpler terms it lets me read post request inputs
app.use(express.urlencoded({ extended: false }));

//setting up my session middleware
app.use(session({
  secret: process.env.sessionKey ?? "LocalSecret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60, rolling: true} //logout automatically after an hour of inactivity
}));

//setting up passport to use my session. First one intializes passport, second one lets passport access my sessions made with express-session
app.use(passport.initialize());
app.use(passport.session());

//logs all pages accessed
app.use((req, res, next) => {
  console.log(req.path.toUpperCase(), req.body);
  next();
});

//checks every request to see if the path requested is a protected route. If they're not logged in, redirect to login page
app.use(isAuthenticated);

//sets up route handlers for the main, login, and register pages I created in passportUsers.mjs
app.use(authRouter);

//lets all my handlebars access my user data
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//sets up route handler for profile page
app.use(profileRouter);

//route handler for main page
app.get('/', function(req, res) {
    res.render("index");
  });















app.listen(process.env.PORT ?? 3000);



