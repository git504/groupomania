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
router.post("/", validateToken, upload, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  post.image = req.file.path;
  await Posts.create(post);
  res.json(post);
});

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

//image?
//https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb/6466669-modifiez-les-routes-pour-prendre-en-compte-les-fichiers
router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
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
