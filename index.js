const express = require("express");
const app = express();



const cors = require("cors");
require("dotenv").config();

app.use(logger);
app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);
//static img folder
app.use("/images", express.static("./images"));
//app.use("/images", express.static(path.join(__dirname, "images")))



db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
  })
  .catch((err) => {
    console.log(err);
  });

function logger(req, res, next) {
  console.log("originalUrl : " + req.originalUrl);
  next();
}
