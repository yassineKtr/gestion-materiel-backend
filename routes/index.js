const router = require("express").Router();
const verify = require("../helpers/verifytoken");

router.use("/user", require("./auth"));
router.use("/articles", verify, require("./articles"));

module.exports = router;
