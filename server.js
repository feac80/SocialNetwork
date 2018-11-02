require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const morgan = require('morgan');
const users = require('./routes/api/v1/users.js');
const profile = require('./routes/api/v1/profile.js');
const posts = require('./routes/api/v1/posts.js');

const app = express();

//DB config
mongoose
  .connect(
    process.env.MONGOURI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected DB');
  })
  .catch(error => {
    console.log(error);
  });

app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// passport config

//config use
// app.use(passport.session());
app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/v1/users', users);
app.use('/api/v1/profile', profile);
app.use('/api/v1/posts', posts);

app.listen(process.env.PORT, () => {
  console.log(`The app is up and running on server ${process.env.PORT}`);
});
