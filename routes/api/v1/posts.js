const express = require("express");
const router = express.Router();

//@route GET api/v1/posts
//@desc Tests post route
//@access Public
router.get("/", (req, res) => {
  res.json({ msg: "OK" });
});

module.exports = router;
