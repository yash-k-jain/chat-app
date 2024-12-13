const express = require('express');

const protectedRoute = require('../lib/middlewares/protectedRoute');
const { getUser, getRequests, removeFriend, sendRequest, acceptRequest, rejectRequest } = require('../controller/user.controller.js');

const router = express.Router();

router.get("/getUser/:id", getUser);

router.get("/getRequests", protectedRoute, getRequests);
router.post("/removeFriend/:id", protectedRoute, removeFriend);
router.post("/sendRequest/:id", protectedRoute, sendRequest);
router.post("/acceptRequest/:id", protectedRoute, acceptRequest);
router.post("/rejectRequest/:id", protectedRoute, rejectRequest);

module.exports = router;