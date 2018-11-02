const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const Users = require('../../../models/Users.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Load input validation
const validateRegisterInput = require('../../../validation/register');

//@route POST api/v1/users
//@desc register user (signup)
//@access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Users.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.status(400).json({
        email: 'email already exist'
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      const newUser = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar,
        date: new Date()
      });

      bcrypt
        .genSalt(10)
        .then(salt => {
          bcrypt
            .hash(req.body.password, salt)
            // Store hash in your password DB.
            .then(hash => {
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.status(201).json({
                    msg: 'The user has been created',
                    name: user.name,
                    email: user.email,
                    date: user.date
                  });
                })
                .catch(err => {
                  res.status(500).json({
                    msg: 'Something went wrong',
                    errormessage: err.message
                  });
                });
            })
            .catch(err => {
              res.status(500).json({
                msg: 'Something went wrong',
                errormessage: err.message
              });
            });
        })
        .catch(err => {
          res.status(500).json({
            msg: 'Something went wrong',
            errormessage: err.message
          });
        });
    }
  });
});

//@route POST api/v1/users
//@desc Tests returning the jwt
//@access Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Users.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          email: 'User not found'
        });
      } else {
        bcrypt
          .compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              const payload = {
                id: user.id,
                name: user.name,
                avatar: user.avatar
              };
              console.log(process.env.SECRET);
              console.log(payload);
              jwt.sign(
                payload,
                process.env.SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                  if (!err) {
                    res.status(200).json({
                      message: 'Success',
                      token: 'Bearer ' + token
                    });
                  } else {
                    console.log(err);
                  }
                }
              );
            } else {
              return res.status(401).json({
                password: 'Password incorrect'
              });
            }
          })
          .catch(err => {
            res.status(500).json({
              error: err
            });
          });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//@route get api/v1/users/current
//@desc return current user
//@access Private

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
