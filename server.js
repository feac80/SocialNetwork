require("dotenv").config();
const express = require("express");

const users = require("./routes/api/v1/users.js");
const profile = require("./routes/api/v1/profile.js");
const posts = require("./routes/api/v1/posts.js");

const app = express();

const mongoose = require("mongoose");

//DB config
mongoose
  .connect(
    process.env.MONGOURI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected DB");
  })
  .catch(error => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});
//config use
app.use("/api/v1/users", users);
app.use("/api/v1/profile", profile);
app.use("/api/v1/posts", posts);

app.listen(process.env.PORT, () => {
  console.log(`The app is up and running on server ${process.env.PORT}`);
});
