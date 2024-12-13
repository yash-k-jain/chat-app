const express = require('express');

const protectedRoute = require("../lib/middlewares/protectedRoute");
const { register, login, logout, getMe } = require("../controller/auth.controller.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protectedRoute, getMe);

module.exports = router;