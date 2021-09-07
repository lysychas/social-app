const router = require("express").Router();
const Message = require("../models/Message");

// TODO: create error handling

// create message - C
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    return res.status(200).json(savedMessage);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get messages - R
router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({ conversationId: conversationId });
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
