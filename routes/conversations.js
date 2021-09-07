const router = require("express").Router();
const Conversation = require("../models/Conversation");

// TODO: create error handling

// new convo - C
router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;
  const newConversation = new Conversation({
    members: [senderId, receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    return res.status(200).json(savedConversation);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get conversation of user - R
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const conversation = await Conversation.find({
      members: { $in: [userId] }, // $in for finding in array
    });
    return res.status(200).json(conversation);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get conversation including userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  const { firstUserId, secondUserId } = req.params;
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [firstUserId, secondUserId] }, // ordering not important in $all
    });
    return res.status(200).json(conversation);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
