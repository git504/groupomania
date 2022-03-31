const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password, role } = req.body;

  const password_regex =
    /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,}$/;

  try {
    if (!username || !password) {
      return res.status(400).json({ msg: "Fill the form" });
    }
    if (!password_regex.test(password)) {
      return res
        .status(400)
        .json({ msg: "PW not secure 6min alpha digit spec" });
    }
    const isUsernameExist = await Users.findOne({
      attributes: ["username"],
      where: { username: username },
    });
    if (isUsernameExist) {
      return res.status(400).json({ msg: "user already exist" });
    }
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        password: hash,
        role: role,
      });
    });
    return res.status(200).json({ msg: "Vous êtes bien inscrit" });
  } catch (error) {
    res.status(400).json(error);
  }
});

//delete user
router.delete("/deleteuser/:id", validateToken, async (req, res) => {
  const userId = req.params.id;
  const userExist = await Users.findOne({ where: { id: userId } });

  if (!userExist) {
    res.json({ error: "User Doesn't Exist" });
  } else {
    await Users.destroy({
      where: {
        id: userId,
      },
    });
    res.json(`USER NBR ${userId} DELETED SUCCESSFULLY`);
  }
});

router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    res.json({ error: "User Doesn't Exist" });
  } else {
    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match)
        res.json({ error: "Wrong Username And Password Combination" });

      const accessToken = sign(
        { username: user.username, role: user.role, id: user.id },
        "importantsecret"
      );
      res.json({
        token: accessToken,
        username: username,
        role: user.role,
        id: user.id,
      });
    });
  }
});

router.get("/auth", validateToken, (req, res) => {

  res.json(req.user);
  console.log(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

router.put("/changepassword/:id", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { id: req.user.id } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) {
      res.json({ error: "Wrong Password Entered!" });
    } else {
      bcrypt.hash(newPassword, 10).then((hash) => {
        Users.update({ password: hash }, { where: { id: req.user.id } });
        res.json("SUCCESS");
      });
    }
  });
});

module.exports = router;
