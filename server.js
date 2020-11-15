require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const routes = require("./routes");
const ErrorHandler = require("./helpers/errorHandler");

//connect to mongo
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.use(express.json());

// CORS middleware
app.use(cors());

// Routes
app.use("/api", routes);

app.use((req, res, next) => {
  next(new ErrorHandler(404, "Not Found"));
});

app.use((err, req, res, next) => {
  res.status(err.code).json({
    message: err.message,
  });
});

//port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port} `));
