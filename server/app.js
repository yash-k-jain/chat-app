const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

const path = require("path");

const { app, server } = require("./socket/socket.js");

const connectionToDB = require("./db");

dotenv.config();

connectionToDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
})

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../client/dist")))

app.use("/api/auth", require("./routes/auth.route.js"));
app.use("/api/profile", require("./routes/profile.route.js"));
app.use("/api/messages", require("./routes/message.route.js"));
app.use("/api/user", require("./routes/user.route.js"));

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
