const router = require("express").Router();

router.get("/", (_, res) => {
  res.json({
    data: {},
  });
});

module.exports = router;
