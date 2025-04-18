import mongoose from 'mongoose';
import express from 'express';
import passport from 'passport';
import '../db.mjs';

//my user model
const User = mongoose.model('User');

//my express router
const router = express.Router();

//routes that users shouldn't be able to access unless logged in
const protectedRoutes = ["/", "/profile"];

//If the user attempts to reach a protected route while not logged in, redirect to login page
function isAuthenticated(req, res, next){
  if(protectedRoutes.includes(req.path)){
    if(req.user){
      console.log(req.user);
      next();
    }
    else{
      res.redirect("/login");
    }
  }
  else{
    next();
  }
}

router.get("/api/v1/register", (req, res)=>{
  res.render('register',{layout: "layoutLoginRegister"});
})

router.get("/api/v1/login", (req, res)=>{
  res.render('login',{layout: "layoutLoginRegister"});
})

router.post("/api/v1/logout", (req, res)=>{
  req.logOut(()=>{
    req.session.destroy(()=>{
      res.redirect("/login");
    });
  });
});
  
//localPassportMongoose's register method will hash a password for me, check if the user already exists, then make a user automatically
//If registration is succesful, we authenticate the user
router.post('/api/v1/register', function(req, res) {
  User.register(new User({userName:req.body.username, email:req.body.email}), req.body.password, (err, user)=>{
    if(err){
      res.render('register',{error: err.message, layout: "layoutLoginRegister"});
    }
    else{
      passport.authenticate('local')(req, res, function() {
        res.redirect("/");
      });
    }
  });
});

//authenticates user and logs them in if correct
router.post('/api/v1/login', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect("/");
      });
    } else {
      res.render('login', {error:'Your login or password is incorrect.', layout: "layoutLoginRegister"});
    }
  })(req, res, next);
});


export{
  router,
  isAuthenticated
};
