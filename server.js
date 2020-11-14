require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//Import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//connect to mongo
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

//body-parser middleware
app.use(express.json());

// CORS middleware
app.use(cors());

//Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

//port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port} `));
