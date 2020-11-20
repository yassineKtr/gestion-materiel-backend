const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  name: String,
  image: String,
  category: String,
  stock: [{ state: String, quantity: Number }],
});

module.exports = mongoose.model("Article", articleSchema);
