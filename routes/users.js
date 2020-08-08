const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// var bodyParser = require('body-parser');

// router.use(bodyParser());



// Load User model
const User = require('../models/User');
const { forwardAuthenticated, updateAuthenticated } = require('../config/auth');
const { route } = require('.');
const { Router } = require('express');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

//update page
router.get('/update', updateAuthenticated, (req, res) => res.render('update'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });



        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//Update
router.post('/update', async (req, res, next) => {

  // const doc = await User.findOne();

  // // Delete the document so Mongoose won't be able to save changes
  // await MyModel.deleteOne({ _id: doc._id });

  // doc.name = {
  //   email: req.body.email,
  //   password: req.body.password
  // };
  // await doc.save();









  // ***********************************************


  const updateUser = {

    email: req.body.email,
    password: req.body.password
  };


  // var query = { email: email };
  // // *******************************
  // User.findOneAndUpdate({ email: "commonthis2020@gmail.com" }, updateUser, function (err) {
  //   if (err) {
  //     console.log(err);

  //   }
  //   else {
  //     res.redirect("/dashboard");
  //   }

  // })
  // **************************************************


  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(updateUser.password, salt, (err, hash) => {
      if (err) throw err;
      updateUser.password = hash;
      User.findOneAndUpdate({ email: "rushit.gadhiya@gmail.com" }, updateUser, function (err) {
        if (err) {
          console.log(err);

        }
        else {
          res.redirect("/dashboard");
        }

      })
      // .then(user => {
      //   req.flash(
      //     'success_msg',
      //     'You updated '
      //   );
      //   res.redirect('/users/login');
      // })
      // .catch(err => console.log(err));
    });
  });













  // ****************







})




// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
