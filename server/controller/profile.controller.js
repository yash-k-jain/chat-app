const cloudinary = require("cloudinary").v2;

const User = require("../models/user.model");

const updateProfile = async (req, res) => {
  try {
    const { profileImg } = req.body;

    const user = req.user;

    if (user.profileImg) {
      cloudinary.uploader.destroy(
        user.profileImg.split("/").pop().split(".")[0]
      );
    }

    const uploadResult = await cloudinary.uploader.upload(profileImg);
    user.profileImg = uploadResult.secure_url;
    await user.save();

    res.status(200).json({ message: "Profile Image updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateProfile, getProfile };
