const express = require('express');

const protectedRoute = require("../lib/middlewares/protectedRoute");
const { updateProfile, getProfile } = require("../controller/profile.controller.js");

const router = express.Router();

router.get("/:id", protectedRoute, getProfile)
router.post("/update", protectedRoute, updateProfile);

module.exports = router;