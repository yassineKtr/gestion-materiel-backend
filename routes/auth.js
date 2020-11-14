const router = require("express").Router();
const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../helpers/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("../helpers/verifytoken");

// ************************** registration ********************************
router.post("/register", async (req, res) => {
  //validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  //checking if the user is already in the db
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({ message: "email already exists" });

  //hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create a new user
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
router.post("/login", async (req, res) => {
  //validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  //checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).json({ message: "Invalid Email or Password" });

  //checking if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(401).json({ message: "Invalid Email or Password" });

  //when logged in
  //create and assign a token
  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

router.post("/check", verify, (req, res) => {
  res.status(200).end();
});
module.exports = router;
