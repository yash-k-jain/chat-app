const User = require("../models/user.model");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRequests = async (req, res) => {
  try {
    const id = req.user._id;

    const usersWithRequests = await User.find({
      requests: { $elemMatch: { receiverId: id } },
    })
      .populate("requests.senderId", "name profileImg")
      .select("requests");

    if (!usersWithRequests || usersWithRequests.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(usersWithRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeFriend = async (req, res) => {
  const { id: friendId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) {
      return res.status(404).json({ error: "User not found" });
    }

    user.friends = user.friends.filter(
      (friend) => friend.toString() !== friendId.toString()
    );
    friend.friends = friend.friends.filter(
      (friend) => friend.toString() !== userId.toString()
    );
    await user.save();
    await friend.save();
    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendRequest = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  try {
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ error: "Cannot send request to yourself" });
    }

    const currentUser = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!currentUser || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      currentUser.friends.includes(receiverId) ||
      receiver.friends.includes(senderId)
    ) {
      currentUser.friends = currentUser.friends.filter(
        (friend) => friend.toString() !== receiverId.toString()
      );
      receiver.friends = receiver.friends.filter(
        (friend) => friend.toString() !== senderId.toString()
      );
    } else if (
      currentUser.requests.some(
        (request) => request.receiverId.toString() === receiverId.toString()
      )
    ) {
      currentUser.requests = currentUser.requests.filter(
        (request) => request.receiverId.toString() !== receiverId.toString()
      );
    } else {
      currentUser.requests.push({ senderId, receiverId });
    }

    await currentUser.save();
    await receiver.save();
    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const acceptRequest = async (req, res) => {
  const { id: requestId } = req.params;
  try {
    const request = await User.find({
      requests: { $elemMatch: { _id: requestId } },
    })
      .populate("requests.senderId", "name profileImg")
      .select("requests");
    if (!request || request.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const currentUser = await User.findById(request[0]?.requests[0]?.senderId);
    const receiver = await User.findById(request[0]?.requests[0]?.receiverId);
    if (!currentUser || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    currentUser.friends.push(request[0].requests[0].receiverId);
    receiver.friends.push(request[0].requests[0].senderId);
    currentUser.requests = currentUser.requests.filter(
      (request) => request._id.toString() !== requestId.toString()
    );
    await currentUser.save();
    await receiver.save();
    res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const rejectRequest = async (req, res) => {
  const { id: requestId } = req.params;
  try {
    const request = await User.find({
      requests: { $elemMatch: { _id: requestId } },
    })
      .populate("requests.senderId", "name profileImg")
      .select("requests");
    if (!request || request.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const sender = await User.findById(request[0]?.requests[0]?.senderId);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    sender.requests = sender.requests.filter(
      (request) => request._id.toString() !== requestId.toString()
    );
    await sender.save();
    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUser,
  getRequests,
  removeFriend,
  sendRequest,
  acceptRequest,
  rejectRequest,
};
