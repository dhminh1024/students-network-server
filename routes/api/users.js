var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  res.send("User API");
});

module.exports = router;
