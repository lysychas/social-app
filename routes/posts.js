const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// create a post - C
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get a post - R
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get timeline posts - R
router.get("/timeline/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const currentUser = await User.findById(userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get all posts of user - R
router.get("/profile/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username });
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// update a post - U
router.put("/:id", async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      return res.status(200).json("Post has been updated");
    } else {
      return res.status(403).json("You can update only your post!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// delete a post - D
router.delete("/:id", async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      return res.status(200).json("Post has been deleted");
    } else {
      return res.status(403).json("You can delete only your post!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// like/dislike a post
router.put("/:id/like", async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      return res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      return res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
