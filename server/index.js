const express = require("express");
const app = express();

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3001");
const cors = require("cors");
require("dotenv").config();

app.use(logger);
app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
//static img folder
app.use("/Images", express.static("./Images"));
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log("SERVER RUNNING ON PORT " + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

function logger(req, res, next) {
  console.log("originalUrl : " + req.originalUrl);
  next();
}
