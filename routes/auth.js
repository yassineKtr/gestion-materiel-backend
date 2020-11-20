const router = require("express").Router();
const User = require("../models/User");
const { registerValidation } = require("../helpers/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("../helpers/verifytoken");
const ErrorHandler = require("../helpers/errorHandler");

// ************************** registration ********************************
router.post("/register", async (req, res) => {
  //validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({ message: "email already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    permissions: req.body.permissions,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

//*********************************** login ********************************
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new ErrorHandler(422, "Invalid Email or Password");
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) throw new ErrorHandler(422, "Invalid Email or Password");

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/check", verify, (req, res) => {
  res.status(200).end();
});

module.exports = router;
