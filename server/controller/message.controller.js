const Conversation = require("../models/conversation.model.js");
const Message = require("../models/message.model");
const User = require("../models/user.model");

const { io, getReceiverSocketId } = require("../socket/socket");

const sendMessage = async (req, res) => {
  const { id: receiverId } = req.params;
  const { message } = req.body;
  const senderId = req.user._id;

  try {
    const currentUser = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!currentUser || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      !(
        currentUser.friends.includes(receiverId) &&
        receiver.friends.includes(senderId)
      )
    ) {
      return res
        .status(404)
        .json({ error: "You are not a friend with this user." });
    }
    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await newMessage.save();
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessage = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate("messages");
    if (!conversation) {
      return res.status(404).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage, getMessage };
