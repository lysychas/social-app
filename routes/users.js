const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// get a user - R
router.get("/", async (req, res) => {
  const { userId, username } = req.query;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc; // any container will do, it's just for temp storage
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// update user - U
router.put("/:id", async (req, res) => {
  const { userId, password, isAdmin } = req.body;
  const { id } = req.params;
  if (userId === id || isAdmin) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      await User.findByIdAndUpdate(id, { $set: req.body });
      return res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else return res.status(403).json("You can update only your account!");
});

// delete user - D
router.delete("/:id", async (req, res) => {
  const { userId, isAdmin } = req.body;
  const { id } = req.params;
  if (userId === id || isAdmin) {
    try {
      await User.findByIdAndDelete(id);
      return res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else return res.status(403).json("You can delete only your account!");
});

// follow a user
router.put("/:id/follow", async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  if (userId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);
      if (!user.followers.includes(userId)) {
        await user.updateOne({ $push: { followers: userId } });
        await currentUser.updateOne({ $push: { followings: id } });
        return res.status(200).json("User has been followed");
      } else {
        return res.status(403).json("You already follow this user");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can't follow yourself");
  }
});

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  if (userId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);
      if (user.followers.includes(userId)) {
        await user.updateOne({ $pull: { followers: userId } });
        await currentUser.updateOne({ $pull: { followings: id } });
        return res.status(200).json("User has been unfollowed");
      } else {
        return res.status(403).json("You don't follow this user");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;
