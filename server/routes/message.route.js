const express = require('express');

const protectedRoute = require('../lib/middlewares/protectedRoute');
const { sendMessage, getMessage } = require('../controller/message.controller.js');

const router = express.Router();

router.get("/:id", protectedRoute, getMessage);
router.post("/send/:id", protectedRoute, sendMessage);

module.exports = router;