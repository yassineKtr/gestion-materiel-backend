const router = require("express").Router();
const Article = require("../models/Article");
const { articleValidation } = require("../helpers/validation");
const ErrorHandler = require("../helpers/errorHandler");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

//READ ALL
router.get("/", async (req, res, next) => {
  try {
    const articles = await Article.find({});
    res.json(articles);
  } catch (error) {
    next(error);
  }
});

//READ ONE
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id))
    return next(new ErrorHandler(422, "ObjectId format not valid"));
  const articles = await Article.findOne({
    _id: id,
  });

  if (!articles) return next(new ErrorHandler(404, "Item not Found"));
  res.json(articles);
});

//CREATE ONE
router.post("/", async (req, res, next) => {
  const article = req.body;
  const { error } = articleValidation(article);
  if (error) return next(new ErrorHandler(422, error.details[0].message));
  const finalArticle = new Article(req.body);

  const inserted = await finalArticle.save();
  res.json(inserted);
});

//UPDATE ONE
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const article = req.body;
  if (!ObjectId.isValid(id))
    return next(new ErrorHandler(422, "ObjectId format not valid"));
  const { error } = articleValidation(article);
  if (error) return next(new ErrorHandler(422, error.details[0].message));

  const articleById = await Article.findOne({
    _id: id,
  });
  if (!articleById) return next(new ErrorHandler(404, "Item not Found"));

  const updated = await Article.findByIdAndUpdate(id, {
    $set: article,
  });
  res.json(articleById);
});

//DELETE ONE
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id))
    return next(new ErrorHandler(422, "ObjectId format not valid"));

  const articleById = await Article.findOne({
    _id: id,
  });
  if (!articleById) return next(new ErrorHandler(404, "Item not Found"));

  const deleted = await Article.findByIdAndDelete(id);
  res.send("deleted");
});

module.exports = router;
