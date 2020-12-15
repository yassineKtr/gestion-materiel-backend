const router = require("express").Router();
const Article = require("../models/Article");
const { articleValidation } = require("../helpers/validation");
const ErrorHandler = require("../helpers/errorHandler");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const { paginatedResults } = require("../helpers/paginatedResults");
const multer = require("multer");

//upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});

//READ ALL
router.get("/", paginatedResults(Article), (req, res, next) => {
  //url : /articles?page=55&limit=55
  res.json(res.paginatedResults);
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
router.post("/", upload.single("image"), async (req, res, next) => {
  if (!req.file) return next(new ErrorHandler(404, "please select an image"));
  const article = {
    name: req.body.name,
    image: req.file.path,
    category: req.body.category,
    stock: req.body.stock,
  };
  const { error } = articleValidation(article);
  if (error) return next(new ErrorHandler(422, error.details[0].message));
  const finalArticle = new Article({
    name: req.body.name,
    image: req.file.path,
    category: req.body.category,
    stock: req.body.stock,
  });

  const inserted = await finalArticle.save();
  res.json(inserted);
});

//UPDATE ONE
router.put("/:id", upload.single("image"), async (req, res, next) => {
  const { id } = req.params;
  const article = {
    name: req.body.name,
    image: req.file.path,
    category: req.body.category,
    stock: req.body.stock,
  };
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
