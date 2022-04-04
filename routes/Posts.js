const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
//const path = require("path");

const { validateToken } = require("../middlewares/AuthMiddleware");
const { upload } = require("../middlewares/multer-config");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({
    order: [["updatedAt", "DESC"]],
    include: [Likes],
  });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    order: [["updatedAt", "DESC"]],
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

//images
router.put("/:id", validateToken, upload, async (req, res) => {
  console.log("bonjourrrrrrrrrrrrrrrrrrrrrrrrrrooooooooooooooooooooooooooooo")
  const postid = req.params.id;
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  post.image = req.file?.path;

  await Posts.update(post,{
    where: {
      id: postid,
    },
  }).then(()=>{
      res.status(200).json("Post modifié avec succès");
  }).catch(err => res.status(400).json(err.response));


});

router.post("/", validateToken, upload, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  post.image = req.file?.path;
  await Posts.create(post).then(()=>{
      res.status(200).json(post);
  }).catch(err => res.status(400).json(err.response));

  // res.json(post);
});

// https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb/6466697-developpez-la-fonction-delete-du-back-end
router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
